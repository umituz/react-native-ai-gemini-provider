/**
 * Generate Text Use Case
 * Orchestrates text generation flow
 */

import type { GeminiGenerationConfig, GeminiResponse } from "../../domain/entities";
import type { ITextGenerationRepository } from "../../domain/repositories/text-generation.repository";
import { ValidationService } from "../../domain/services/validation.service";
import { GenerationRequest } from "../dtos/generation-request.dto";
import { ContentMapper } from "../../infrastructure/mappers/content.mapper";

export interface GenerateTextOptions {
  model: string;
  prompt: string;
  config?: GeminiGenerationConfig;
  signal?: AbortSignal;
}

export interface GenerateTextResult {
  text: string;
  response?: GeminiResponse;
}

export class GenerateTextUseCase {
  constructor(
    private readonly repository: ITextGenerationRepository,
    private readonly validator: ValidationService,
    private readonly contentMapper: ContentMapper
  ) {}

  /**
   * Execute text generation
   */
  async execute(options: GenerateTextOptions): Promise<GenerateTextResult> {
    // Validate inputs
    this.validator.validatePrompt(options.prompt);
    this.validator.validateModelName(options.model);
    this.validator.validateConfig(options.config);

    // Create request
    const contents = [
      this.contentMapper.createTextContent(options.prompt, "user"),
    ];

    const request = new GenerationRequest(
      options.model,
      contents,
      options.config,
      options.signal
    );

    // Execute
    const response = await this.repository.generate({
      model: request.model,
      contents: request.contents,
      generationConfig: request.generationConfig,
      signal: request.signal,
    });

    // Extract text
    const text = await this.repository.generateText(
      options.model,
      options.prompt,
      options.config,
      options.signal
    );

    return {
      text,
      response,
    };
  }

  /**
   * Execute simple text generation (returns only text)
   */
  async executeSimple(options: GenerateTextOptions): Promise<string> {
    const result = await this.execute(options);
    return result.text;
  }
}
