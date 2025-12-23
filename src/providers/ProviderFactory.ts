/**
 * Provider Factory
 * Creates and configures AI provider instances with tier-based settings
 */

import { geminiClientCoreService } from "../infrastructure/services/gemini-client-core.service";
import type { GeminiConfig } from "../domain/entities";
import type {
  ProviderConfigInput,
  ResolvedProviderConfig,
} from "./ProviderConfig";
import {
  resolveProviderConfig,
  getCostOptimizedConfig,
  getQualityOptimizedConfig,
} from "./ProviderConfig";

declare const __DEV__: boolean;

export type OptimizationStrategy = "cost" | "quality" | "balanced";

export interface ProviderFactoryOptions extends ProviderConfigInput {
  /** Optimization strategy (overrides tier defaults) */
  strategy?: OptimizationStrategy;
}

class ProviderFactory {
  private currentConfig: ResolvedProviderConfig | null = null;

  /**
   * Initialize provider with tier-based configuration
   */
  initialize(options: ProviderFactoryOptions): void {
    let config: ResolvedProviderConfig;

    // Apply optimization strategy
    switch (options.strategy) {
      case "cost":
        config = getCostOptimizedConfig(options);
        break;
      case "quality":
        config = getQualityOptimizedConfig(options);
        break;
      case "balanced":
      default:
        config = resolveProviderConfig(options);
        break;
    }

    this.currentConfig = config;

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[ProviderFactory] Initializing with config:", {
        tier: config.subscriptionTier,
        strategy: options.strategy || "balanced",
        textModel: config.textModel,
        imageEditModel: config.imageEditModel,
        maxRetries: config.maxRetries,
      });
    }

    // Initialize Gemini client with resolved config
    const geminiConfig: GeminiConfig = {
      apiKey: config.apiKey,
      imageModel: config.imageEditModel,
      maxRetries: config.maxRetries,
      baseDelay: config.baseDelay,
      maxDelay: config.maxDelay,
      defaultTimeoutMs: config.timeout,
      defaultModel: config.textModel,
    };

    geminiClientCoreService.initialize(geminiConfig);

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[ProviderFactory] Provider initialized successfully");
    }
  }

  /**
   * Get current resolved configuration
   */
  getConfig(): ResolvedProviderConfig | null {
    return this.currentConfig;
  }

  /**
   * Check if provider is initialized
   */
  isInitialized(): boolean {
    return this.currentConfig !== null;
  }

  /**
   * Update configuration without re-initializing
   * Useful for switching models or adjusting settings
   */
  updateConfig(updates: Partial<ProviderConfigInput>): void {
    if (!this.currentConfig) {
      throw new Error(
        "Provider not initialized. Call initialize() first.",
      );
    }

    const newInput: ProviderConfigInput = {
      apiKey: updates.apiKey || this.currentConfig.apiKey,
      subscriptionTier:
        updates.subscriptionTier || this.currentConfig.subscriptionTier,
      preferences: {
        ...updates.preferences,
      },
    };

    this.initialize(newInput);
  }
}

export const providerFactory = new ProviderFactory();
