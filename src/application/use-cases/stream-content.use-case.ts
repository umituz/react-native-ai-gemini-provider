/**
 * Stream Content Use Case
 * Orchestrates streaming flow
 */

import type { GeminiGenerationConfig } from "../../domain/entities";
import type { IStreamingRepository } from "../../domain/repositories/streaming.repository";
import { ValidationService } from "../../domain/services/validation.service";
import { GenerationRequest } from "../dtos/generation-request.dto";
import { ContentMapper } from "../../infrastructure/mappers/content.mapper";

export interface StreamContentOptions {
  model: string;
  prompt: string;
  onChunk: (text: string) => void;
  config?: GeminiGenerationConfig;
  signal?: AbortSignal;
}

export class StreamContentUseCase {
  constructor(
    private readonly repository: IStreamingRepository,
    private readonly validator: ValidationService,
    private readonly contentMapper: ContentMapper
  ) {}

  /**
   * Execute streaming
   */
  async execute(options: StreamContentOptions): Promise<string> {
    // Validate inputs
    this.validator.validatePrompt(options.prompt);
    this.validator.validateModelName(options.model);
    this.validator.validateCallback(options.onChunk, "onChunk");
    this.validator.validateConfig(options.config);

    // Execute
    return this.repository.streamText(
      options.model,
      options.prompt,
      options.onChunk,
      options.config,
      options.signal
    );
  }
}
