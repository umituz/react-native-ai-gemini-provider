import type { GeminiConfig } from "../../domain/entities";
import { geminiClient } from "./GeminiClient";
import { structuredText } from "./StructuredText";

export class GeminiProvider {
  readonly providerId = "gemini";
  readonly providerName = "Google Gemini";

  initialize(config: GeminiConfig): void {
    geminiClient.initialize(config);
  }

  isInitialized(): boolean {
    return geminiClient.isInitialized();
  }

  reset(): void {
    geminiClient.reset();
  }

  async generateStructuredText<T>(
    prompt: string,
    schema: Record<string, unknown>,
    model: string,
  ): Promise<T> {
    if (!prompt || prompt.trim().length < 3) {
      throw new Error("Prompt must be at least 3 characters");
    }

    if (!this.isInitialized()) {
      throw new Error("Provider not initialized. Call initialize() first.");
    }

    return structuredText.generateStructuredText<T>(model, prompt, schema);
  }
}

export const geminiProvider = new GeminiProvider();
