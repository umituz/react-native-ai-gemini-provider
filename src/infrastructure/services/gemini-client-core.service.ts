/**
 * Gemini Client Core Service
 * Handles client initialization, configuration, and validation
 */

import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import { DEFAULT_MODELS } from "../../domain/entities";
import type { GeminiConfig } from "../../domain/entities";

declare const __DEV__: boolean;

const DEFAULT_CONFIG: Partial<GeminiConfig> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  defaultTimeoutMs: 60000,
  textModel: DEFAULT_MODELS.TEXT,
  textToImageModel: DEFAULT_MODELS.TEXT_TO_IMAGE,
  imageEditModel: DEFAULT_MODELS.IMAGE_EDIT,
};

class GeminiClientCoreService {
  private client: GoogleGenerativeAI | null = null;
  private config: GeminiConfig | null = null;
  private initialized = false;

  initialize(config: GeminiConfig): void {
    if (this.initialized) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log("[GeminiClient] Already initialized, skipping");
      }
      return;
    }

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiClient] initialize() called", {
        hasApiKey: !!config.apiKey,
        textModel: config.textModel,
        textToImageModel: config.textToImageModel,
        imageEditModel: config.imageEditModel,
      });
    }

    this.client = new GoogleGenerativeAI(config.apiKey);
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initialized = true;

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiClient] initialized successfully", {
        textModel: this.config.textModel,
        textToImageModel: this.config.textToImageModel,
        imageEditModel: this.config.imageEditModel,
        maxRetries: this.config.maxRetries,
      });
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getConfig(): GeminiConfig | null {
    return this.config;
  }

  getClient(): GoogleGenerativeAI | null {
    return this.client;
  }

  validateInitialization(): void {
    if (!this.client || !this.initialized) {
      throw new Error(
        "Gemini client not initialized. Call initialize() first.",
      );
    }
  }

  getModel(modelName?: string): GenerativeModel {
    this.validateInitialization();
    const effectiveModel = modelName || this.config?.textModel || DEFAULT_MODELS.TEXT;
    return this.client!.getGenerativeModel({ model: effectiveModel });
  }

  reset(): void {
    this.client = null;
    this.config = null;
    this.initialized = false;
  }
}

export const geminiClientCoreService = new GeminiClientCoreService();
