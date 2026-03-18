/**
 * Text Generation Repository Interface
 * Domain layer contract for text generation operations
 */

import type { GeminiContent, GeminiGenerationConfig, GeminiResponse } from "../entities";

export interface TextGenerationRequest {
  model: string;
  contents: GeminiContent[];
  generationConfig?: GeminiGenerationConfig;
  signal?: AbortSignal;
}

export interface ITextGenerationRepository {
  /**
   * Generate text content from Gemini API
   * @param request - Generation request parameters
   * @returns Generated response
   * @throws GeminiError on API errors
   */
  generate(request: TextGenerationRequest): Promise<GeminiResponse>;

  /**
   * Generate simple text from a prompt
   * @param model - Model name
   * @param prompt - Text prompt
   * @param config - Optional generation config
   * @param signal - Optional abort signal
   * @returns Generated text
   */
  generateText(
    model: string,
    prompt: string,
    config?: GeminiGenerationConfig,
    signal?: AbortSignal
  ): Promise<string>;
}
