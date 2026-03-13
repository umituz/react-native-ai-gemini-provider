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
    const apiKey = config.apiKey?.trim();

    if (!apiKey || apiKey.length < 10) {
      throw new Error("API key is required and must be at least 10 characters");
    }

    // Basic format validation for Google AI API keys (starts with "AIza")
    if (!apiKey.startsWith("AIza")) {
      throw new Error('Invalid API key format. Google AI API keys should start with "AIza"');
    }

    // Allow re-initialization with new config (e.g. API key change)
    this.client = new GoogleGenerativeAI(apiKey);
    this.config = { ...DEFAULT_CONFIG, ...config, apiKey };
    this.initialized = true;
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
      ? opts.safetySettings.map((s) => {
          // Validate safety settings to prevent runtime errors
          const validCategories = [
            HarmCategory.HARM_CATEGORY_HARASSMENT,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          ];

          const validThresholds = [
            HarmBlockThreshold.BLOCK_NONE,
            HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            HarmBlockThreshold.BLOCK_ONLY_HIGH,
          ];

          // Check if category and threshold are valid enum values
          const category = validCategories.includes(s.category as unknown as HarmCategory)
            ? (s.category as unknown as HarmCategory)
            : HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT; // Fallback to safest

          const threshold = validThresholds.includes(s.threshold as unknown as HarmBlockThreshold)
            ? (s.threshold as unknown as HarmBlockThreshold)
            : HarmBlockThreshold.BLOCK_NONE; // Fallback to most permissive

          return { category, threshold };
        })
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
