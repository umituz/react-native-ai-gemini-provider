
import { geminiClientCoreService } from "../infrastructure/services/gemini-client-core.service";
import type { GeminiConfig } from "../domain/entities";
import type {
  ProviderConfigInput,
  ResolvedProviderConfig,
} from "./ProviderConfig";
import { resolveProviderConfig } from "./ProviderConfig";

export interface ProviderFactoryOptions extends ProviderConfigInput {
  /** Provider strategy */
  strategy?: "cost" | "quality";
}

class ProviderFactory {
  private currentConfig: ResolvedProviderConfig | null = null;
  private currentOptions: ProviderFactoryOptions | null = null;

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
    this.currentOptions = options;

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
    if (!this.currentConfig || !this.currentOptions) {
      throw new Error("Provider not initialized. Call initialize() first.");
    }

    // If API key is changing, we need to re-initialize
    if (updates.apiKey && updates.apiKey !== this.currentConfig.apiKey) {
      const newInput: ProviderFactoryOptions = {
        apiKey: updates.apiKey,
        preferences: updates.preferences || this.currentOptions.preferences,
        strategy: this.currentOptions.strategy,
      };
      this.initialize(newInput);
      return;
    }

    // For other updates, merge with current config
    const mergedPreferences = {
      ...this.currentOptions.preferences,
      ...updates.preferences,
    };

    this.currentOptions.preferences = mergedPreferences;

    this.currentConfig = {
      apiKey: this.currentConfig.apiKey,
      textModel: this.currentConfig.textModel,
      timeout: mergedPreferences.timeout ?? this.currentConfig.timeout,
    };
  }
}

export const providerFactory = new ProviderFactory();
