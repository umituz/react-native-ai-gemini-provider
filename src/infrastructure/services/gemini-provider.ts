
import type { GeminiConfig } from "../../domain/entities";
import { geminiClientCoreService } from "./gemini-client-core.service";
import { geminiTextGenerationService } from "./gemini-text-generation.service";
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
   * Generate text from prompt
   */
  async generateText(prompt: string, model: string): Promise<string> {
    const contents = [{ parts: [{ text: prompt }], role: "user" as const }];
    const response = await geminiTextGenerationService.generateContent(model, contents);
    return this.extractTextFromResponse(response);
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

  /**
   * Extract text from Gemini response
   */
  private extractTextFromResponse(response: unknown): string {
    const resp = response as {
      candidates?: Array<{
        content: {
          parts: Array<{ text?: string }>;
        };
      }>;
    };

    return resp.candidates?.[0]?.content.parts
      .filter((p): p is { text: string } => "text" in p && typeof p.text === "string")
      .map((p) => p.text)
      .join("") || "";
  }
}

export const geminiProviderService = new GeminiProvider();

export function createGeminiProvider(): GeminiProvider {
  return new GeminiProvider();
}
