/**
 * Gemini Provider
 * Main provider for dependency injection
 */

import { ValidationService } from "../../domain/services/validation.service";
import { ContentMapper, ResponseMapper } from "../../infrastructure/mappers";
import {
  GeminiTextRepository,
  GeminiStreamingRepository,
  GeminiStructuredTextRepository,
} from "../../infrastructure/repositories";
import { geminiClient } from "../../infrastructure/external/gemini-client.singleton";
import type { GeminiConfig } from "../../domain/entities";
import type {
  ITextGenerationRepository,
  IStreamingRepository,
  IStructuredTextRepository,
} from "../../domain/repositories";

export class GeminiProviderClass {
  private static instance: GeminiProviderClass | null = null;
  static resetCalled = false;

  readonly _validator: ValidationService;
  readonly _contentMapper: ContentMapper;
  readonly _responseMapper: ResponseMapper;

  private readonly textRepository: ITextGenerationRepository;
  private readonly streamingRepository: IStreamingRepository;
  private readonly structuredTextRepository: IStructuredTextRepository;

  private constructor() {
    this._validator = new ValidationService();
    this._contentMapper = new ContentMapper();
    this._responseMapper = new ResponseMapper();

    // Initialize repositories
    const getModel = (name: string) => geminiClient.getModel(name);

    this.textRepository = new GeminiTextRepository(
      getModel,
      this._validator,
      this._contentMapper,
      this._responseMapper
    );

    this.streamingRepository = new GeminiStreamingRepository(
      getModel,
      this._validator,
      this._contentMapper
    );

    this.structuredTextRepository = new GeminiStructuredTextRepository(
      getModel,
      this._validator,
      this._contentMapper,
      this._responseMapper
    );
  }

  /**
   * Get singleton instance
   */
  static getInstance(): GeminiProviderClass {
    if (!GeminiProviderClass.instance) {
      GeminiProviderClass.instance = new GeminiProviderClass();
    }
    return GeminiProviderClass.instance;
  }

  /**
   * Initialize with configuration
   */
  initialize(config: GeminiConfig): void {
    geminiClient.initialize(config.apiKey);
  }

  /**
   * Get validation service (public for use cases)
   */
  getValidator(): ValidationService {
    return this._validator;
  }

  /**
   * Get content mapper (public for use cases)
   */
  getContentMapper(): ContentMapper {
    return this._contentMapper;
  }

  /**
   * Get text generation repository
   */
  getTextRepository(): ITextGenerationRepository {
    return this.textRepository;
  }

  /**
   * Get streaming repository
   */
  getStreamingRepository(): IStreamingRepository {
    return this.streamingRepository;
  }

  /**
   * Get structured text repository
   */
  getStructuredTextRepository(): IStructuredTextRepository {
    return this.structuredTextRepository;
  }

  /**
   * Reset provider (for testing)
   */
  static reset(): void {
    GeminiProviderClass.instance = null;
    geminiClient.reset();
    // Also expose globally for React components
    if (typeof global !== 'undefined') {
      (global as any).__geminiProviderReset = true;
    }
  }
}

/**
 * Export singleton instance
 */
export const geminiProvider = GeminiProviderClass.getInstance();

/**
 * Type alias for cleaner API
 */
export type GeminiProvider = GeminiProviderClass;
