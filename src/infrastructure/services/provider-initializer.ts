/**
 * Provider Initializer
 * Handles initialization logic for Gemini Provider
 */

import type { AIProviderConfig } from "@umituz/react-native-ai-generation-content";
import type { GeminiConfig } from "../../domain/entities";
import { geminiClientCoreService } from "./gemini-client-core.service";

declare const __DEV__: boolean;

export interface GeminiProviderConfig extends AIProviderConfig {
  textModel?: string;
  textToImageModel?: string;
  imageEditModel?: string;
}

export class ProviderInitializer {
    initialize(config: GeminiProviderConfig): void {
        if (typeof __DEV__ !== "undefined" && __DEV__) {
            // eslint-disable-next-line no-console
            console.log("[GeminiProvider] Initializing...");
        }

        const geminiConfig: GeminiConfig = {
            apiKey: config.apiKey,
            maxRetries: config.maxRetries,
            baseDelay: config.baseDelay,
            maxDelay: config.maxDelay,
            defaultTimeoutMs: config.defaultTimeoutMs,
            textModel: config.textModel,
            textToImageModel: config.textToImageModel,
            imageEditModel: config.imageEditModel,
        };

        geminiClientCoreService.initialize(geminiConfig);
    }

    isInitialized(): boolean {
        return geminiClientCoreService.isInitialized();
    }

    reset(): void {
        geminiClientCoreService.reset();
    }
}

export const providerInitializer = new ProviderInitializer();
