/**
 * Gemini Provider
 * Text-only AI provider for Google Gemini
 */

import type { GeminiConfig, GeminiImageInput } from "../../domain/entities";
import { providerInitializer } from "./provider-initializer";
import { generationExecutor } from "./generation-executor";

export type GeminiProviderConfig = GeminiConfig;

/**
 * Gemini Provider - Text Generation Only
 * For image/video generation, use FAL Provider instead
 */
export class GeminiProvider {
  readonly providerId = "gemini";
  readonly providerName = "Google Gemini";

  initialize(config: GeminiProviderConfig): void {
    providerInitializer.initialize(config);
  }

  isInitialized(): boolean {
    return providerInitializer.isInitialized();
  }

  reset(): void {
    providerInitializer.reset();
  }

  /**
   * Generate text from prompt
   */
  async generateText(prompt: string, model: string): Promise<string> {
    return generationExecutor.executeTextGeneration(prompt, model);
  }

  /**
   * Generate text with images (multimodal)
   * Useful for "describe this image" scenarios
   */
  async generateTextWithImages(
    prompt: string,
    images: GeminiImageInput[],
    model: string,
  ): Promise<string> {
    const result = await generationExecutor.generateWithImages(
      model,
      prompt,
      images,
    );
    return result.text;
  }

  /**
   * Generate structured JSON response
   */
  async generateStructuredText<T>(
    prompt: string,
    schema: Record<string, unknown>,
    model: string,
  ): Promise<T> {
    return generationExecutor.executeStructuredGeneration<T>(prompt, schema, model);
  }
}

export const geminiProviderService = new GeminiProvider();

export function createGeminiProvider(): GeminiProvider {
  return new GeminiProvider();
}
