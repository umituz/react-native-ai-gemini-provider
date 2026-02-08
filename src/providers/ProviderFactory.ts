
import { geminiClientCoreService } from "../infrastructure/services/gemini-client-core.service";
import type { GeminiConfig } from "../domain/entities";
import type {
  ProviderConfigInput,
  ResolvedProviderConfig,
} from "./ProviderConfig";
import { resolveProviderConfig } from "./ProviderConfig";

export interface ProviderFactoryOptions extends ProviderConfigInput {
  /** Quality preference strategy */
  strategy?: "cost" | "quality";
}

class ProviderFactory {
  private currentConfig: ResolvedProviderConfig | null = null;

  /**
   * Initialize provider with configuration
   */
  initialize(options: ProviderFactoryOptions): void {
    const config = resolveProviderConfig(options);

    // Apply strategy-based adjustments
    if (options.strategy === "quality") {
      config.timeout = 60000; // Longer timeout for quality
    }

    this.currentConfig = config;

    // Initialize Gemini client with resolved config
    const geminiConfig: GeminiConfig = {
      apiKey: config.apiKey,
      defaultTimeoutMs: config.timeout,
      textModel: config.textModel,
    };

    geminiClientCoreService.initialize(geminiConfig);
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
   * Note: Changing apiKey requires full re-initialization
   */
  updateConfig(updates: Partial<ProviderConfigInput>): void {
    if (!this.currentConfig) {
      throw new Error("Provider not initialized. Call initialize() first.");
    }

    // If API key is changing, we need to re-initialize
    if (updates.apiKey && updates.apiKey !== this.currentConfig.apiKey) {
      const newInput: ProviderConfigInput = {
        apiKey: updates.apiKey,
        preferences: updates.preferences || {},
      };
      this.initialize(newInput);
      return;
    }

    // For other updates, merge with current config
    this.currentConfig = {
      ...this.currentConfig,
      ...updates.preferences,
      timeout: updates.preferences?.timeout ?? this.currentConfig.timeout,
    };
  }
}

export const providerFactory = new ProviderFactory();
