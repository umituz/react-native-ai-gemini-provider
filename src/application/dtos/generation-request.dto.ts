/**
 * Generation Request DTO
 * Data transfer object for generation requests
 */

import type { GeminiContent, GeminiGenerationConfig } from "../../domain/entities";

export class GenerationRequest {
  constructor(
    readonly model: string,
    readonly contents: GeminiContent[],
    readonly generationConfig?: GeminiGenerationConfig,
    readonly signal?: AbortSignal
  ) {}

  /**
   * Create a simple text generation request
   */
  static forText(
    model: string,
    prompt: string,
    config?: GeminiGenerationConfig,
    signal?: AbortSignal
  ): GenerationRequest {
    return new GenerationRequest(model, [], config, signal);
  }

  /**
   * Create a streaming request
   */
  static forStream(
    model: string,
    prompt: string,
    onChunk: (text: string) => void,
    config?: GeminiGenerationConfig,
    signal?: AbortSignal
  ): GenerationRequest {
    return new GenerationRequest(model, [], config, signal);
  }

  /**
   * Check if request has abort signal
   */
  hasSignal(): boolean {
    return this.signal !== undefined;
  }

  /**
   * Check if request is aborted
   */
  isAborted(): boolean {
    return this.signal?.aborted ?? false;
  }
}

export class StructuredGenerationRequest {
  constructor(
    readonly model: string,
    readonly prompt: string,
    readonly schema: Record<string, unknown>,
    readonly config?: Omit<GeminiGenerationConfig, "responseMimeType" | "responseSchema">,
    readonly signal?: AbortSignal
  ) {}

  /**
   * Get full generation config with JSON response settings
   */
  getConfig(): GeminiGenerationConfig {
    return {
      ...this.config,
      responseMimeType: "application/json",
      responseSchema: this.schema as any,
    };
  }

  /**
   * Check if request has abort signal
   */
  hasSignal(): boolean {
    return this.signal !== undefined;
  }

  /**
   * Check if request is aborted
   */
  isAborted(): boolean {
    return this.signal?.aborted ?? false;
  }
}
