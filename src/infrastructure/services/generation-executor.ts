/**
 * Generation Executor
 * Handles execution of text generation
 */

import { geminiTextGenerationService } from "./gemini-text-generation.service";
import { geminiStructuredTextService } from "./gemini-structured-text.service";


export interface ExecutionOptions {
  onProgress?: (progress: number) => void;
}

export interface GenerationInput {
  prompt?: string;
  generationConfig?: unknown;
}

export type GenerationResult = string;

export class GenerationExecutor {
  /**
   * Execute text generation
   */
  async executeTextGeneration(prompt: string, model: string): Promise<string> {

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

    return geminiStructuredTextService.generateStructuredText<T>(
      model,
      prompt,
      schema,
    );
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
