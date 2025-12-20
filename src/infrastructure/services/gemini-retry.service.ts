/**
 * Gemini Retry Service
 * Handles retry logic with exponential backoff
 */

import { geminiClientCoreService } from "./gemini-client-core.service";

declare const __DEV__: boolean;

const RETRYABLE_ERROR_PATTERNS = [
  "rate limit",
  "too many requests",
  "429",
  "500",
  "502",
  "503",
  "504",
  "timeout",
  "network",
  "econnrefused",
  "fetch failed",
];

function isRetryableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return RETRYABLE_ERROR_PATTERNS.some((pattern) => message.includes(pattern));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class GeminiRetryService {
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    retryCount = 0,
  ): Promise<T> {
    const config = geminiClientCoreService.getConfig();
    const maxRetries = config?.maxRetries ?? 3;
    const baseDelay = config?.baseDelay ?? 1000;
    const maxDelay = config?.maxDelay ?? 10000;

    try {
      return await operation();
    } catch (error) {
      if (!isRetryableError(error) || retryCount >= maxRetries) {
        throw error;
      }

      const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);

      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log(`[Gemini] Retry ${retryCount + 1}/${maxRetries} after ${delay}ms`);
      }

      await sleep(delay);
      return this.executeWithRetry(operation, retryCount + 1);
    }
  }
}

export const geminiRetryService = new GeminiRetryService();
