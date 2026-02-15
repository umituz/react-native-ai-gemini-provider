/**
 * Base Gemini Service
 * Common functionality for all Gemini services to eliminate code duplication
 */

import { geminiClientCoreService } from "./gemini-client-core.service";
import { toSdkContent } from "../utils/content-mapper.util";
import { createGeminiError } from "../utils/error-mapper.util";
import type { GeminiContent, GeminiGenerationConfig } from "../../domain/entities";
import type { GenerativeModel } from "@google/generative-ai";

/**
 * Base request options structure
 */
export interface BaseRequestOptions {
  model: string;
  contents: GeminiContent[];
  generationConfig?: GeminiGenerationConfig;
  signal?: AbortSignal;
}

/**
 * Abstract base service with common patterns
 */
export abstract class BaseGeminiService {
  /**
   * Validate and prepare request
   * Eliminates duplicate validation and abort checks
   */
  protected validateAndPrepare(options: BaseRequestOptions): {
    genModel: GenerativeModel;
    sdkContents: Array<{ role: string; parts: Array<{ text: string }> }>;
  } {
    // Validate contents
    if (!options.contents || options.contents.length === 0) {
      throw new Error("Contents array cannot be empty");
    }

    // Check for early abort
    if (options.signal?.aborted) {
      throw new Error("Request was aborted");
    }

    const genModel = geminiClientCoreService.getModel(options.model);
    const sdkContents = toSdkContent(options.contents);

    return { genModel, sdkContents };
  }

  /**
   * Handle errors uniformly across all services
   * Eliminates duplicate error handling logic
   */
  protected handleError(error: unknown, abortMessage: string): never {
    // Re-throw as GeminiError if it's already an API error
    if (error instanceof Error && error.name === "GeminiError") {
      throw error;
    }

    // Check for abort error
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(abortMessage);
    }

    // Wrap other errors
    throw createGeminiError(error);
  }

  /**
   * Create typed request options for SDK
   * Type-safe request creation
   */
  protected createRequestOptions(
    sdkContents: Array<{ role: string; parts: Array<{ text: string }> }>,
    generationConfig?: GeminiGenerationConfig
  ) {
    return {
      contents: sdkContents,
      generationConfig,
    };
  }
}
