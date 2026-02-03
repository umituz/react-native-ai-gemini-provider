/**
 * Provider Initializer
 * Handles initialization logic for Gemini Provider
 */

import type { GeminiConfig } from "../../domain/entities";
import { geminiClientCoreService } from "./gemini-client-core.service";

declare const __DEV__: boolean;

export type GeminiProviderConfig = GeminiConfig;

export class ProviderInitializer {
  initialize(config: GeminiProviderConfig): void {
    if (geminiClientCoreService.isInitialized()) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[GeminiProvider] Already initialized, skipping");
      }
      return;
    }

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[GeminiProvider] Initializing...");
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
