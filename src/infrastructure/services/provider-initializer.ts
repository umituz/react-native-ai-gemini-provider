/**
 * Provider Initializer
 * Handles initialization logic for Gemini Provider
 */

import type { GeminiConfig } from "../../domain/entities";
import { geminiClientCoreService } from "./gemini-client-core.service";


export type GeminiProviderConfig = GeminiConfig;

export class ProviderInitializer {
  initialize(config: GeminiProviderConfig): void {
    if (geminiClientCoreService.isInitialized()) {
      return;
    }


    geminiClientCoreService.initialize(config);
  }

  isInitialized(): boolean {
    return geminiClientCoreService.isInitialized();
  }

  reset(): void {
    geminiClientCoreService.reset();
  }
}

export const providerInitializer = new ProviderInitializer();
