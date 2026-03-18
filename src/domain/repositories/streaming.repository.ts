/**
 * Streaming Repository Interface
 * Domain layer contract for streaming operations
 */

import type { GeminiContent, GeminiGenerationConfig } from "../entities";

export interface StreamingRequest {
  model: string;
  contents: GeminiContent[];
  onChunk: (text: string) => void;
  generationConfig?: GeminiGenerationConfig;
  signal?: AbortSignal;
}

export interface IStreamingRepository {
  /**
   * Stream text content from Gemini API
   * @param request - Streaming request parameters
   * @returns Complete generated text
   * @throws GeminiError on API errors
   */
  stream(request: StreamingRequest): Promise<string>;

  /**
   * Stream text from a simple prompt
   * @param model - Model name
   * @param prompt - Text prompt
   * @param onChunk - Callback for each chunk
   * @param config - Optional generation config
   * @param signal - Optional abort signal
   * @returns Complete generated text
   */
  streamText(
    model: string,
    prompt: string,
    onChunk: (text: string) => void,
    config?: GeminiGenerationConfig,
    signal?: AbortSignal
  ): Promise<string>;
}
