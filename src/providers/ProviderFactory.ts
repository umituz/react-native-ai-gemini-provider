import { geminiClient } from "../infrastructure/services/GeminiClient";
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

  /**
   * Initialize provider with configuration
   */
  initialize(options: ProviderFactoryOptions): void {
    // Build configuration using builder pattern (inline, no state needed)
    const builder = ConfigBuilder.create().withApiKey(options.apiKey);

    if (options.strategy) {
      builder.withStrategy(options.strategy);
    }

    if (options.textModel) {
      builder.withTextModel(options.textModel);
    }

    if (options.timeout) {
      builder.withTimeout(options.timeout);
    }

    this.currentConfig = builder.build();

    // Initialize Gemini client
    const geminiConfig = builder.toGeminiConfig();
    geminiClient.initialize(geminiConfig);
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

    // Re-initialize with merged config to ensure GeminiClient is updated
    this.initialize({ ...this.currentConfig, ...updates });
  }
}

export const providerFactory = new ProviderFactory();
