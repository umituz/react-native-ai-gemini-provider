/**
 * Generation Executor
 * Handles execution of text generation
 */

import type { GeminiImageInput } from "../../domain/entities";
import { geminiTextGenerationService } from "./gemini-text-generation.service";
import { geminiStructuredTextService } from "./gemini-structured-text.service";

declare const __DEV__: boolean;

export interface ExecutionOptions {
  onProgress?: (progress: number) => void;
}

export interface GenerationInput {
  prompt?: string;
  images?: GeminiImageInput[];
  generationConfig?: unknown;
}

export type GenerationResult = string;

export class GenerationExecutor {
  /**
   * Execute text generation
   */
  async executeTextGeneration(prompt: string, model: string): Promise<string> {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[GenerationExecutor] executeTextGeneration() called", { model });
    }

    const response = await geminiTextGenerationService.generateContent(
      model,
      [{ parts: [{ text: prompt }], role: "user" }],
    );

    return this.extractTextFromResponse(response);
  }

  /**
   * Execute structured text generation (JSON output)
   */
  async executeStructuredGeneration<T>(
    prompt: string,
    schema: Record<string, unknown>,
    model: string,
  ): Promise<T> {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[GenerationExecutor] executeStructuredGeneration() called", { model });
    }

    return geminiStructuredTextService.generateStructuredText<T>(
      model,
      prompt,
      schema,
    );
  }

  /**
   * Generate text with images (multimodal)
   */
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

  /**
   * Extract text from Gemini response
   */
  private extractTextFromResponse(response: unknown): string {
    const resp = response as {
      candidates?: Array<{
        content: {
          parts: Array<{ text?: string }>;
        };
      }>;
    };

    return resp.candidates?.[0]?.content.parts
      .filter((p): p is { text: string } => "text" in p && typeof p.text === "string")
      .map((p) => p.text)
      .join("") || "";
  }
}

export const generationExecutor = new GenerationExecutor();
