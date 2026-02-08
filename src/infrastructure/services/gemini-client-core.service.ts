import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import { DEFAULT_MODELS, GEMINI_MODELS } from "../../domain/entities";
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
   * Validate model name against known models
   */
  private validateModel(modelName: string): void {
    const knownModels = Object.values(GEMINI_MODELS.TEXT);
    const isValid = knownModels.some((model) => model === modelName);

    if (!isValid) {
      throw new Error(`Unknown model: "${modelName}". Known models: ${knownModels.join(", ")}`);
    }
  }

  getModel(modelName?: string): GenerativeModel {
    this.validateInitialization();

    if (!this.client) {
      throw new Error("Gemini client not available");
    }

    const effectiveModel = modelName || this.config?.textModel || DEFAULT_MODELS.TEXT;

    // Validate model name
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
