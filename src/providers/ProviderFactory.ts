import { geminiClientCoreService } from "../infrastructure/services/gemini-client-core.service";
import { ConfigBuilder, type ProviderConfig } from "./ConfigBuilder";

// Re-export for public API
export { ConfigBuilder } from "./ConfigBuilder";
export type { ProviderConfig } from "./ConfigBuilder";

export interface ProviderFactoryOptions {
  apiKey: string;
  timeout?: number;
  textModel?: string;
  strategy?: "cost" | "quality";
}

class ProviderFactory {
  private currentConfig: ProviderConfig | null = null;
  private builder: ConfigBuilder | null = null;

  /**
   * Initialize provider with configuration
   */
  initialize(options: ProviderFactoryOptions): void {
    // Build configuration using builder pattern
    this.builder = ConfigBuilder.create()
      .withApiKey(options.apiKey);

    if (options.strategy) {
      this.builder.withStrategy(options.strategy);
    }

    if (options.textModel) {
      this.builder.withTextModel(options.textModel);
    }

    if (options.timeout) {
      this.builder.withTimeout(options.timeout);
    }

    this.currentConfig = this.builder.build();

    // Initialize Gemini client
    const geminiConfig = this.builder.toGeminiConfig();
    geminiClientCoreService.initialize(geminiConfig);
  }

  /**
   * Get current configuration
   */
  getConfig(): ProviderConfig | null {
    return this.currentConfig;
  }

  /**
   * Check if provider is initialized
   */
  isInitialized(): boolean {
    return this.currentConfig !== null;
  }

  /**
   * Update configuration
   * API key changes require re-initialization
   */
  updateConfig(updates: Partial<ProviderFactoryOptions>): void {
    if (!this.currentConfig) {
      throw new Error("Provider not initialized. Call initialize() first.");
    }

    // If API key changes, re-initialize
    if (updates.apiKey && updates.apiKey !== this.currentConfig.apiKey) {
      this.initialize({ ...this.currentConfig, ...updates });
      return;
    }

    // Otherwise, update using builder
    this.builder = ConfigBuilder.from({ ...this.currentConfig, ...updates });
    this.currentConfig = this.builder.build();
  }
}

export const providerFactory = new ProviderFactory();
