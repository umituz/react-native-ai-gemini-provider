import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import { DEFAULT_MODELS } from "../../domain/entities";
import type { GeminiConfig } from "../../domain/entities";
import { validateModelName, validateApiKey } from "../utils/validation.util";

const DEFAULT_CONFIG: Partial<GeminiConfig> = {
  textModel: DEFAULT_MODELS.TEXT,
};

class GeminiClientCoreService {
  private client: GoogleGenerativeAI | null = null;
  private config: GeminiConfig | null = null;
  private initialized = false;

  /**
   * Initialize the Gemini client with configuration
   *
   * @throws {Error} If already initialized or API key is invalid
   */
  initialize(config: GeminiConfig): void {
    if (this.initialized) {
      throw new Error("Gemini client already initialized. Call reset() before re-initializing with new config.");
    }

    // Validate API key
    validateApiKey(config.apiKey);

    this.client = new GoogleGenerativeAI(config.apiKey);
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initialized = true;
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
      throw new Error("Gemini client not initialized. Call initialize() first.");
    }
  }


  getModel(modelName?: string): GenerativeModel {
    this.validateInitialization();

    if (!this.client) {
      throw new Error("Gemini client not available");
    }

    const effectiveModel = modelName || this.config?.textModel || DEFAULT_MODELS.TEXT;

    // Validate model name format
    validateModelName(effectiveModel);

    return this.client.getGenerativeModel({ model: effectiveModel });
  }

  reset(): void {
    this.client = null;
    this.config = null;
    this.initialized = false;
  }
}

export const geminiClientCoreService = new GeminiClientCoreService();
