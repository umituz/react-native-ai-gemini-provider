
import type { GeminiConfig } from "../../domain/entities";
import { geminiClientCoreService } from "./gemini-client-core.service";
import { geminiStructuredTextService } from "./gemini-structured-text.service";
import { validatePrompt } from "../utils/validation.util";

export type GeminiProviderConfig = GeminiConfig;

export class GeminiProvider {
  readonly providerId = "gemini";
  readonly providerName = "Google Gemini";

  /**
   * Initialize the Gemini provider
   *
   * @throws {Error} If already initialized or configuration is invalid
   */
  initialize(config: GeminiProviderConfig): void {
    if (geminiClientCoreService.isInitialized()) {
      throw new Error("Provider already initialized. Call reset() before re-initializing with new config.");
    }
    geminiClientCoreService.initialize(config);
  }

  /**
   * Check if provider is initialized
   */
  isInitialized(): boolean {
    return geminiClientCoreService.isInitialized();
  }

  /**
   * Reset the provider to uninitialized state
   */
  reset(): void {
    geminiClientCoreService.reset();
  }

  /**
   * Generate structured JSON response
   *
   * @throws {GeminiError} For API-specific errors
   * @throws {Error} For validation or network errors
   */
  async generateStructuredText<T>(
    prompt: string,
    schema: Record<string, unknown>,
    model: string,
  ): Promise<T> {
    // Validate inputs
    validatePrompt(prompt);

    // Check if initialized
    if (!this.isInitialized()) {
      throw new Error("Provider not initialized. Call initialize() first.");
    }

    return geminiStructuredTextService.generateStructuredText<T>(model, prompt, schema);
  }
}

export const geminiProviderService = new GeminiProvider();
