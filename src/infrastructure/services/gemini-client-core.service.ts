import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import { DEFAULT_MODELS } from "../../domain/entities";
import type { GeminiConfig } from "../../domain/entities";

const DEFAULT_CONFIG: Partial<GeminiConfig> = {
  textModel: DEFAULT_MODELS.TEXT,
};

class GeminiClientCoreService {
  private client: GoogleGenerativeAI | null = null;
  private config: GeminiConfig | null = null;
  private initialized = false;

  initialize(config: GeminiConfig): void {
    if (this.initialized) {
      throw new Error("Gemini client already initialized. Call reset() before re-initializing with new config.");
    }

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

  /**
   * Validate model name format (allows any valid model string)
   */
  private validateModel(modelName: string): void {
    if (!modelName || typeof modelName !== "string" || modelName.trim().length === 0) {
      throw new Error(`Invalid model name: "${modelName}". Model name must be a non-empty string.`);
    }

    // Check for valid model format (starts with gemini-)
    if (!modelName.startsWith("gemini-")) {
      throw new Error(`Invalid model name: "${modelName}". Gemini models should start with "gemini-".`);
    }
  }

  getModel(modelName?: string): GenerativeModel {
    this.validateInitialization();

    if (!this.client) {
      throw new Error("Gemini client not available");
    }

    const effectiveModel = modelName || this.config?.textModel || DEFAULT_MODELS.TEXT;

    // Validate model name format (not against hardcoded list)
    this.validateModel(effectiveModel);

    return this.client.getGenerativeModel({ model: effectiveModel });
  }

  reset(): void {
    this.client = null;
    this.config = null;
    this.initialized = false;
  }
}

export const geminiClientCoreService = new GeminiClientCoreService();
