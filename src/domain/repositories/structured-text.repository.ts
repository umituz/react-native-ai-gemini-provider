/**
 * Structured Text Repository Interface
 * Domain layer contract for structured JSON generation
 */

import type { GeminiContent, GeminiGenerationConfig } from "../entities";

export interface StructuredGenerationRequest {
  model: string;
  prompt: string;
  schema: Record<string, unknown>;
  config?: Omit<GeminiGenerationConfig, "responseMimeType" | "responseSchema">;
  signal?: AbortSignal;
}

export interface IStructuredTextRepository {
  /**
   * Generate structured JSON response from Gemini API
   * @param request - Structured generation request
   * @returns Parsed JSON response
   * @throws GeminiError on API errors
   */
  generateStructured<T>(request: StructuredGenerationRequest): Promise<T>;

  /**
   * Generate structured JSON from contents
   * @param model - Model name
   * @param contents - Content array
   * @param schema - JSON schema
   * @param config - Optional generation config
   * @param signal - Optional abort signal
   * @returns Parsed JSON response
   */
  generateStructuredFromContents<T>(
    model: string,
    contents: GeminiContent[],
    schema: Record<string, unknown>,
    config?: GeminiGenerationConfig,
    signal?: AbortSignal
  ): Promise<T>;
}
