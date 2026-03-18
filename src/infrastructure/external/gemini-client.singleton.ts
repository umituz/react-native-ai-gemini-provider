/**
 * Gemini Client Singleton
 * Global access point for Gemini SDK adapter
 */

import { GeminiSDKAdapter } from "./gemini-sdk.adapter";

let instance: GeminiSDKAdapter | null = null;

export class GeminiClient {
  private constructor() {}

  /**
   * Get the singleton instance
   */
  static getInstance(): GeminiSDKAdapter {
    if (!instance) {
      instance = new GeminiSDKAdapter();
    }
    return instance;
  }

  /**
   * Export adapter class for type safety
   */
  static Adapter = GeminiSDKAdapter;

  /**
   * Initialize the client (convenience method)
   */
  static initialize(apiKey: string): void {
    GeminiClient.getInstance().initialize(apiKey);
  }

  /**
   * Reset the client (for testing)
   */
  static reset(): void {
    if (instance) {
      instance.reset();
      instance = null;
    }
  }
}

/**
 * Export a simpler interface for backward compatibility
 */
export const geminiClient = GeminiClient.getInstance();
