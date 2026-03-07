import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  type GenerativeModel,
  type SafetySetting,
} from "@google/generative-ai";
import { DEFAULT_MODELS } from "../../domain/entities";
import type { GeminiConfig, GeminiModelOptions } from "../../domain/entities";

const DEFAULT_CONFIG: Partial<GeminiConfig> = {
  textModel: DEFAULT_MODELS.TEXT,
};

/** All categories set to BLOCK_NONE */
const PERMISSIVE_SAFETY: SafetySetting[] = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

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

  /**
   * Returns a GenerativeModel configured with optional safety settings and system instruction.
   * When no safety settings are provided, defaults to BLOCK_NONE for all categories.
   */
  getModel(modelNameOrOptions?: string | GeminiModelOptions): GenerativeModel {
    if (!this.client || !this.initialized) {
      throw new Error("Gemini client not initialized. Call initialize() first.");
    }

    // Normalize args
    const opts: GeminiModelOptions =
      typeof modelNameOrOptions === "string"
        ? { model: modelNameOrOptions }
        : modelNameOrOptions ?? {};

    const effectiveModel = opts.model || this.config?.textModel || DEFAULT_MODELS.TEXT;

    if (!effectiveModel.startsWith("gemini-")) {
      throw new Error('Model name must start with "gemini-"');
    }

    // Map package safety settings to SDK format
    const sdkSafety: SafetySetting[] = opts.safetySettings
      ? opts.safetySettings.map((s) => ({
          category: s.category as unknown as HarmCategory,
          threshold: s.threshold as unknown as HarmBlockThreshold,
        }))
      : PERMISSIVE_SAFETY;

    return this.client.getGenerativeModel({
      model: effectiveModel,
      ...(opts.systemInstruction && { systemInstruction: opts.systemInstruction }),
      safetySettings: sdkSafety,
    });
  }

  reset(): void {
    this.client = null;
    this.config = null;
    this.initialized = false;
  }
}

export const geminiClient = new GeminiClient();
