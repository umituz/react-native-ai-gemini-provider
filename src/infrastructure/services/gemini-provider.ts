
import type { GeminiConfig } from "../../domain/entities";
import { geminiClientCoreService } from "./gemini-client-core.service";
import { geminiStructuredTextService } from "./gemini-structured-text.service";

export type GeminiProviderConfig = GeminiConfig;

export class GeminiProvider {
  readonly providerId = "gemini";
  readonly providerName = "Google Gemini";

  initialize(config: GeminiProviderConfig): void {
    if (geminiClientCoreService.isInitialized()) {
      throw new Error("Provider already initialized. Call reset() before re-initializing with new config.");
    }
    geminiClientCoreService.initialize(config);
  }

  isInitialized(): boolean {
    return geminiClientCoreService.isInitialized();
  }

  reset(): void {
    geminiClientCoreService.reset();
  }

  /**
   * Generate structured JSON response
   */
  async generateStructuredText<T>(
    prompt: string,
    schema: Record<string, unknown>,
    model: string,
  ): Promise<T> {
    return geminiStructuredTextService.generateStructuredText<T>(model, prompt, schema);
  }
}

export const geminiProviderService = new GeminiProvider();
