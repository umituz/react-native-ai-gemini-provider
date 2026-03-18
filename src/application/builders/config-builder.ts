/**
 * Configuration Builder
 * Fluent API for building Gemini configuration
 */

import { DEFAULT_MODELS } from "../../domain/entities";
import type { GeminiConfig } from "../../domain/entities";

export interface GeminiConfigOptions {
  apiKey: string;
  model?: string;
  timeout?: number;
  strategy?: "cost" | "quality";
}

export class GeminiConfigBuilder {
  private apiKey?: string;
  private model: string = DEFAULT_MODELS.TEXT;
  private timeout = 30000;
  private strategy?: "cost" | "quality";

  /**
   * Set API key (required)
   */
  withApiKey(apiKey: string): this {
    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
      throw new Error("API key must be a non-empty string");
    }
    this.apiKey = apiKey.trim();
    return this;
  }

  /**
   * Set model name
   */
  withModel(model: string): this {
    if (!model || !model.startsWith("gemini-")) {
      throw new Error("Invalid model name. Must start with 'gemini-'");
    }
    this.model = model;
    return this;
  }

  /**
   * Set request timeout (ms)
   */
  withTimeout(timeout: number): this {
    if (timeout <= 0 || timeout > 300000) {
      throw new Error("Timeout must be between 1ms and 300000ms (5 minutes)");
    }
    this.timeout = timeout;
    return this;
  }

  /**
   * Set strategy and apply preset timeout
   */
  withStrategy(strategy: "cost" | "quality"): this {
    this.strategy = strategy;

    // Apply strategy-based defaults
    if (strategy === "quality") {
      this.timeout = 60000; // 1 minute for quality
    } else {
      this.timeout = 30000; // 30 seconds for cost
    }

    return this;
  }

  /**
   * Build final configuration
   */
  build(): GeminiConfig {
    if (!this.apiKey) {
      throw new Error("API key is required. Call withApiKey() before build()");
    }

    return {
      apiKey: this.apiKey,
      textModel: this.model,
      defaultTimeoutMs: this.timeout,
    };
  }

  /**
   * Create a new builder instance
   */
  static create(): GeminiConfigBuilder {
    return new GeminiConfigBuilder();
  }

  /**
   * Create builder from existing config
   */
  static from(config: GeminiConfig): GeminiConfigBuilder {
    return new GeminiConfigBuilder()
      .withApiKey(config.apiKey)
      .withModel(config.textModel || DEFAULT_MODELS.TEXT)
      .withTimeout(config.defaultTimeoutMs || 30000);
  }
}
