import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import { DEFAULT_MODELS } from "../../domain/entities";
import type { GeminiConfig } from "../../domain/entities";

const DEFAULT_CONFIG: Partial<GeminiConfig> = {
  textModel: DEFAULT_MODELS.TEXT,
};

class GeminiClient {
  private client: GoogleGenerativeAI | null = null;
  private config: GeminiConfig | null = null;
  private initialized = false;

  initialize(config: GeminiConfig): void {
    if (this.initialized) return;

    if (!config.apiKey || config.apiKey.trim().length < 10) {
      throw new Error("API key is required and must be at least 10 characters");
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

  getModel(modelName?: string): GenerativeModel {
    if (!this.client || !this.initialized) {
      throw new Error("Gemini client not initialized. Call initialize() first.");
    }

    const effectiveModel = modelName || this.config?.textModel || DEFAULT_MODELS.TEXT;

    if (!effectiveModel.startsWith("gemini-")) {
      throw new Error('Model name must start with "gemini-"');
    }

    return this.client.getGenerativeModel({ model: effectiveModel });
  }

  reset(): void {
    this.client = null;
    this.config = null;
    this.initialized = false;
  }
}

export const geminiClient = new GeminiClient();
