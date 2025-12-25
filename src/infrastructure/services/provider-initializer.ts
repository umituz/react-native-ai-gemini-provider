/**
 * Provider Initializer
 * Handles initialization logic for Gemini Provider
 */

import type { GeminiConfig } from "../../domain/entities";
import { geminiClientCoreService } from "./gemini-client-core.service";

declare const __DEV__: boolean;

export interface AIProviderConfig {
    apiKey: string;
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    defaultTimeoutMs?: number;
    textModel?: string;
    textToImageModel?: string;
    imageEditModel?: string;
}

export class ProviderInitializer {
    initialize(config: AIProviderConfig): void {
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
