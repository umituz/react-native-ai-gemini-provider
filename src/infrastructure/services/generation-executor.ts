/**
 * Generation Executor
 * Handles execution of different generation types
 */

import type {
    GeminiImageInput,
} from "../../domain/entities";
import { geminiTextGenerationService } from "./gemini-text-generation.service";
import { geminiImageGenerationService } from "./gemini-image-generation.service";
import { ContentBuilder } from "../content/ContentBuilder";
import { ResponseFormatter } from "../response/ResponseFormatter";

export class GenerationExecutor {
    private contentBuilder = new ContentBuilder();
    private responseFormatter = new ResponseFormatter();

    async executeGeneration<T>(
        model: string,
        input: Record<string, unknown>,
    ): Promise<T> {
        const isImageGeneration = input.generateImage === true || input.type === "image";

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
