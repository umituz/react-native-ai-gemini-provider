/**
 * Gemini SDK Adapter
 * Wrapper around Google Gemini SDK
 */

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  type GenerativeModel,
  type SafetySetting,
} from "@google/generative-ai";
import { DEFAULT_MODELS } from "../../domain/entities";
import type { GeminiModelOptions } from "../../domain/entities";

/**
 * Permissive safety settings (BLOCK_NONE for all categories)
 */
const PERMISSIVE_SAFETY: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export class GeminiSDKAdapter {
  private client: GoogleGenerativeAI | null = null;
  private initialized = false;

  /**
   * Initialize the SDK with API key
   */
  initialize(apiKey: string): void {
    if (!apiKey || apiKey.length < 10) {
      throw new Error("API key must be at least 10 characters");
    }

    if (!apiKey.startsWith("AIza")) {
      throw new Error('Invalid API key format. Must start with "AIza"');
    }

    this.client = new GoogleGenerativeAI(apiKey);
    this.initialized = true;
  }

  /**
   * Get a configured GenerativeModel
   */
  getModel(options?: string | GeminiModelOptions): GenerativeModel {
    if (!this.client || !this.initialized) {
      throw new Error("SDK not initialized. Call initialize() first.");
    }

    // Normalize options
    const opts: GeminiModelOptions =
      typeof options === "string" ? { model: options } : options ?? {};

    const effectiveModel = opts.model || DEFAULT_MODELS.TEXT;

    if (!effectiveModel.startsWith("gemini-")) {
      throw new Error('Model name must start with "gemini-"');
    }

    // Map safety settings
    const sdkSafety = opts.safetySettings
      ? this.mapSafetySettings(opts.safetySettings)
      : PERMISSIVE_SAFETY;

    return this.client.getGenerativeModel({
      model: effectiveModel,
      ...(opts.systemInstruction && {
        systemInstruction: opts.systemInstruction,
      }),
      safetySettings: sdkSafety,
    });
  }

  /**
   * Map domain safety settings to SDK format
   */
  private mapSafetySettings(
    settings: GeminiModelOptions["safetySettings"]
  ): SafetySetting[] {
    if (!settings) return PERMISSIVE_SAFETY;

    return settings.map((s) => {
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

      const category = validCategories.includes(
        s.category as unknown as HarmCategory
      )
        ? (s.category as unknown as HarmCategory)
        : HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT;

      const threshold = validThresholds.includes(
        s.threshold as unknown as HarmBlockThreshold
      )
        ? (s.threshold as unknown as HarmBlockThreshold)
        : HarmBlockThreshold.BLOCK_NONE;

      return { category, threshold };
    });
  }

  /**
   * Check if SDK is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Reset the SDK
   */
  reset(): void {
    this.client = null;
    this.initialized = false;
  }
}
