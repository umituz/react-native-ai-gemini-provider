/**
 * Config Builder Pattern
 * Fluent API for building provider configuration
 */

import { DEFAULT_MODELS } from "../domain/entities";
import type { GeminiConfig } from "../domain/entities";

export interface ProviderConfig {
  apiKey: string;
  textModel: string;
  timeout: number;
  strategy?: "cost" | "quality";
}

/**
 * Builder for constructing provider configuration
 * Provides a fluent API with validation and defaults
 */
export class ConfigBuilder {
  private config: Omit<Partial<ProviderConfig>, 'textModel' | 'timeout'> & {
    textModel: string;
    timeout: number;
  } = {
    textModel: DEFAULT_MODELS.TEXT,
    timeout: 30000,
  };

  /**
   * Set API key (required)
   */
  withApiKey(apiKey: string): this {
    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
      throw new Error("API key must be a non-empty string");
    }
    this.config.apiKey = apiKey.trim();
    return this;
  }

  /**
   * Set text model
   */
  withTextModel(model: string): this {
    if (!model || !model.startsWith("gemini-")) {
      throw new Error("Invalid model name");
    }
    this.config.textModel = model;
    return this;
  }

  /**
   * Set request timeout (ms)
   */
  withTimeout(timeout: number): this {
    if (timeout <= 0 || timeout > 300000) {
      throw new Error("Timeout must be between 1ms and 300000ms (5 minutes)");
    }
    this.config.timeout = timeout;
    return this;
  }

  /**
   * Set strategy (applies preset timeout)
   */
  withStrategy(strategy: "cost" | "quality"): this {
    this.config.strategy = strategy;

    // Apply strategy-based defaults
    if (strategy === "quality") {
      this.config.timeout = 60000;
    } else {
      this.config.timeout = 30000;
    }

    return this;
  }

  /**
   * Build final configuration
   */
  build(): ProviderConfig {
    if (!this.config.apiKey) {
      throw new Error("API key is required. Call withApiKey() before build()");
    }

    return {
      apiKey: this.config.apiKey,
      textModel: this.config.textModel,
      timeout: this.config.timeout,
      strategy: this.config.strategy,
    };
  }

  /**
   * Convert to GeminiConfig format
   */
  toGeminiConfig(): GeminiConfig {
    const config = this.build();
    return {
      apiKey: config.apiKey,
      textModel: config.textModel,
      defaultTimeoutMs: config.timeout,
    };
  }

  /**
   * Create a new builder instance
   */
  static create(): ConfigBuilder {
    return new ConfigBuilder();
  }
}
