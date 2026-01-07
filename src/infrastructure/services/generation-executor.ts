/**
 * Generation Executor
 * Handles execution of different generation types
 */

import type {
    GeminiImageInput,
    GeminiImageGenerationResult,
    VideoGenerationInput,
    VideoGenerationResult,
    VideoGenerationProgress,
} from "../../domain/entities";
import { geminiTextGenerationService } from "./gemini-text-generation.service";
import { geminiImageGenerationService } from "./gemini-image-generation.service";
import { geminiVideoGenerationService } from "./gemini-video-generation.service";
import { ContentBuilder } from "../content/ContentBuilder";
import { ResponseFormatter } from "../response/ResponseFormatter";

declare const __DEV__: boolean;

export interface ExecutionOptions {
    onProgress?: (progress: number) => void;
}

export type GenerationInput = {
    type?: "text" | "image" | "video";
    generateImage?: boolean;
    prompt?: string;
    images?: GeminiImageInput[];
    generationConfig?: unknown;
    image?: string;
    negativePrompt?: string;
    aspect_ratio?: string;
};

export type GenerationResult =
    | string
    | GeminiImageGenerationResult
    | VideoGenerationResult;

export class GenerationExecutor {
    private contentBuilder = new ContentBuilder();
    private responseFormatter = new ResponseFormatter();

    async executeGeneration<T = GenerationResult>(
        model: string,
        input: GenerationInput,
        options?: ExecutionOptions,
    ): Promise<T> {
        if (typeof __DEV__ !== "undefined" && __DEV__) {
            // eslint-disable-next-line no-console
            console.log("[GenerationExecutor] executeGeneration() called", { model, inputType: input.type });
        }

        const isImageGeneration = input.generateImage === true || input.type === "image";
        const isVideoGeneration = this.isVideoModel(model) || input.type === "video";

        if (typeof __DEV__ !== "undefined" && __DEV__) {
            // eslint-disable-next-line no-console
            console.log("[GenerationExecutor] Generation type:", { isImageGeneration, isVideoGeneration });
        }

        if (isVideoGeneration) {
            return this.executeVideoGeneration(input, options) as T;
        }

        if (isImageGeneration) {
            const prompt = String(input.prompt ?? "");
            const images = input.images;
            return geminiImageGenerationService.generateImage(prompt, images) as T;
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
    private async executeVideoGeneration(
        input: GenerationInput,
        options?: ExecutionOptions,
    ): Promise<VideoGenerationResult> {
        if (typeof __DEV__ !== "undefined" && __DEV__) {
            // eslint-disable-next-line no-console
            console.log("[GenerationExecutor] executeVideoGeneration() called");
        }

        const videoInput: VideoGenerationInput = {
            prompt: String(input.prompt ?? ""),
            image: input.image,
            negativePrompt: input.negativePrompt,
            options: {
                aspectRatio: this.normalizeAspectRatio(input.aspect_ratio),
            },
        };

        const onProgress = options?.onProgress
            ? (p: VideoGenerationProgress) => {
                if (typeof __DEV__ !== "undefined" && __DEV__) {
                    // eslint-disable-next-line no-console
                    console.log("[GenerationExecutor] Progress update:", p.progress);
                }
                options.onProgress?.(p.progress);
            }
            : undefined;

        const result = await geminiVideoGenerationService.generateVideo(videoInput, onProgress);

        if (typeof __DEV__ !== "undefined" && __DEV__) {
            // eslint-disable-next-line no-console
            console.log("[GenerationExecutor] Video generation completed");
        }

        return {
            videoUrl: result.videoUrl,
            metadata: result.metadata,
        };
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
