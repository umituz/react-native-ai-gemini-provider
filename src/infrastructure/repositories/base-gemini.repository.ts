/**
 * Base Gemini Repository
 * Common functionality for all Gemini repositories
 */

import type { GenerativeModel } from "@google/generative-ai";
import type { GeminiContent, GeminiGenerationConfig } from "../../domain/entities";
import { ValidationService } from "../../domain/services/validation.service";
import { ContentMapper } from "../mappers/content.mapper";
import { ErrorMapper } from "../mappers/error.mapper";

export abstract class BaseGeminiRepository {
  protected constructor(
    protected getModel: (name: string) => GenerativeModel,
    protected readonly validator: ValidationService,
    protected readonly contentMapper: ContentMapper
  ) {}

  /**
   * Prepare request parameters
   * @returns SDK model and formatted contents
   */
  protected prepareRequest(params: {
    model: string;
    contents: GeminiContent[];
    generationConfig?: GeminiGenerationConfig;
    signal?: AbortSignal;
  }): {
    genModel: GenerativeModel;
    sdkContents: Array<{ role: string; parts: unknown[] }>;
    config: GeminiGenerationConfig | undefined;
    signal: AbortSignal | undefined;
  } {
    // Validate inputs
    this.validator.validateModelName(params.model);
    this.validator.validateContents(params.contents);
    this.validator.validateConfig(params.generationConfig);

    // Check abort signal
    if (params.signal?.aborted) {
      throw new Error("Request was aborted");
    }

    // Get SDK model
    const genModel = this.getModel(params.model);

    // Convert contents to SDK format
    const sdkContents = this.contentMapper.toSdkArray(params.contents);

    return {
      genModel,
      sdkContents,
      config: params.generationConfig,
      signal: params.signal,
    };
  }

  /**
   * Create request options for SDK
   */
  protected createRequestOptions(
    sdkContents: Array<{ role: string; parts: unknown[] }>,
    generationConfig?: GeminiGenerationConfig
  ): {
    contents: Array<{ role: string; parts: unknown[] }>;
    generationConfig?: GeminiGenerationConfig;
  } {
    return {
      contents: sdkContents,
      generationConfig,
    };
  }

  /**
   * Handle errors consistently
   */
  protected handleError(error: unknown, context: string): never {
    throw ErrorMapper.map(error, context);
  }

  /**
   * Execute with automatic error handling
   */
  protected async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error, context);
    }
  }
}
