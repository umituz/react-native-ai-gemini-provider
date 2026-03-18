/**
 * Generate JSON Use Case
 * Orchestrates structured JSON generation flow
 */

import type { GeminiGenerationConfig } from "../../domain/entities";
import type { IStructuredTextRepository } from "../../domain/repositories/structured-text.repository";
import { ValidationService } from "../../domain/services/validation.service";
import { StructuredGenerationRequest } from "../dtos/generation-request.dto";

export interface GenerateJSONOptions<T> {
  model: string;
  prompt: string;
  schema: Record<string, unknown>;
  config?: Omit<GeminiGenerationConfig, "responseMimeType" | "responseSchema">;
  signal?: AbortSignal;
}

export interface GenerateJSONResult<T> {
  data: T;
  text: string; // Pretty-printed JSON
}

export class GenerateJSONUseCase {
  constructor(
    private readonly repository: IStructuredTextRepository,
    private readonly validator: ValidationService
  ) {}

  /**
   * Execute structured JSON generation
   */
  async execute<T>(
    options: GenerateJSONOptions<T>
  ): Promise<GenerateJSONResult<T>> {
    // Validate inputs
    this.validator.validatePrompt(options.prompt);
    this.validator.validateSchema(options.schema);
    this.validator.validateModelName(options.model);
    this.validator.validateConfig(options.config);

    // Create request
    const request = new StructuredGenerationRequest(
      options.model,
      options.prompt,
      options.schema,
      options.config,
      options.signal
    );

    // Execute
    const data = await this.repository.generateStructured<T>({
      model: request.model,
      prompt: request.prompt,
      schema: request.schema,
      config: request.config,
      signal: request.signal,
    });

    return {
      data,
      text: JSON.stringify(data, null, 2),
    };
  }

  /**
   * Execute simple JSON generation (returns only data)
   */
  async executeSimple<T>(options: GenerateJSONOptions<T>): Promise<T> {
    const result = await this.execute<T>(options);
    return result.data;
  }
}
