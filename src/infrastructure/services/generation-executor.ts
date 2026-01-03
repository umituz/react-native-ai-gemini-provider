/**
 * Generation Executor
 * Handles execution of different generation types
 */

import type {
    GeminiImageInput,
    VideoGenerationInput,
    VideoGenerationProgress,
} from "../../domain/entities";
import { geminiTextGenerationService } from "./gemini-text-generation.service";
import { geminiImageGenerationService } from "./gemini-image-generation.service";
import { geminiVideoGenerationService } from "./gemini-video-generation.service";
import { ContentBuilder } from "../content/ContentBuilder";
import { ResponseFormatter } from "../response/ResponseFormatter";

export interface ExecutionOptions {
    onProgress?: (progress: number) => void;
}

export class GenerationExecutor {
    private contentBuilder = new ContentBuilder();
    private responseFormatter = new ResponseFormatter();

    async executeGeneration<T>(
        model: string,
        input: Record<string, unknown>,
        options?: ExecutionOptions,
    ): Promise<T> {
        const isImageGeneration = input.generateImage === true || input.type === "image";
        const isVideoGeneration = this.isVideoModel(model) || input.type === "video";

        if (isVideoGeneration) {
            return this.executeVideoGeneration<T>(input, options);
        }

        if (isImageGeneration) {
            const prompt = String(input.prompt || "");
            const images = input.images as GeminiImageInput[] | undefined;
            const result = await geminiImageGenerationService.generateImage(prompt, images);
            return result as T;
        }

        const contents = this.contentBuilder.buildContents(input);
        const response = await geminiTextGenerationService.generateContent(
            model,
            contents,
            input.generationConfig as undefined,
        );

        return this.responseFormatter.formatResponse<T>(response, input);
    }

    /**
     * Check if model is a video generation model (Veo)
     */
    private isVideoModel(model: string): boolean {
        return model.toLowerCase().includes("veo");
    }

    /**
     * Execute video generation using Veo API
     */
    private async executeVideoGeneration<T>(
        input: Record<string, unknown>,
        options?: ExecutionOptions,
    ): Promise<T> {
        const videoInput: VideoGenerationInput = {
            prompt: String(input.prompt || ""),
            image: input.image as string | undefined,
            negativePrompt: input.negativePrompt as string | undefined,
            options: {
                aspectRatio: this.normalizeAspectRatio(input.aspect_ratio as string),
            },
        };

        const onProgress = options?.onProgress
            ? (p: VideoGenerationProgress) => options.onProgress?.(p.progress)
            : undefined;

        const result = await geminiVideoGenerationService.generateVideo(videoInput, onProgress);

        return {
            video: { url: result.videoUrl },
            videoUrl: result.videoUrl,
            metadata: result.metadata,
        } as T;
    }

    /**
     * Normalize aspect ratio format (e.g., "16:9" stays, others default)
     */
    private normalizeAspectRatio(ratio: string | undefined): "16:9" | "9:16" | "1:1" {
        if (ratio === "9:16" || ratio === "1:1") return ratio;
        return "16:9";
    }

    async generateWithImages(
        model: string,
        prompt: string,
        images: GeminiImageInput[],
    ): Promise<{ text: string; response: unknown }> {
        const response = await geminiTextGenerationService.generateWithImages(
            model,
            prompt,
            images,
        );

        const text = response.candidates?.[0]?.content.parts
            .filter((p): p is { text: string } => "text" in p)
            .map((p) => p.text)
            .join("") || "";

        return { text, response };
    }
}

export const generationExecutor = new GenerationExecutor();
