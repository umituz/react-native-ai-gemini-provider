/**
 * Gemini Retry Service
 * Handles retry logic with exponential backoff and jitter
 * Jitter helps prevent thundering herd problem in distributed systems
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

/**
 * Add random jitter to delay to prevent synchronized retries
 * Uses full jitter strategy: random between 0 and base_delay * 2^attempt
 */
function calculateDelayWithJitter(
  baseDelay: number,
  retryCount: number,
  maxDelay: number,
): number {
  const exponentialDelay = baseDelay * Math.pow(2, retryCount);
  const cappedDelay = Math.min(exponentialDelay, maxDelay);
  const jitter = Math.random() * cappedDelay;
  return Math.floor(jitter);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  enableJitter?: boolean;
}

class GeminiRetryService {
  /**
   * Execute operation with retry logic
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    retryCount = 0,
    options?: RetryOptions,
  ): Promise<T> {
    const config = geminiClientCoreService.getConfig();
    const maxRetries = options?.maxRetries ?? config?.maxRetries ?? 3;
    const baseDelay = options?.baseDelay ?? config?.baseDelay ?? 1000;
    const maxDelay = options?.maxDelay ?? config?.maxDelay ?? 10000;
    const enableJitter = options?.enableJitter ?? true;

    try {
      return await operation();
    } catch (error) {
      if (!isRetryableError(error) || retryCount >= maxRetries) {
        throw error;
      }

      const delay = enableJitter
        ? calculateDelayWithJitter(baseDelay, retryCount, maxDelay)
        : Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);

      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log(`[Gemini] Retry ${retryCount + 1}/${maxRetries} after ${delay}ms`, {
          jitter: enableJitter,
        });
      }

      await sleep(delay);
      return this.executeWithRetry(operation, retryCount + 1, options);
    }
  }

  /**
   * Check if an error is retryable
   */
  isRetryableError(error: unknown): boolean {
    return isRetryableError(error);
  }
}

export const geminiRetryService = new GeminiRetryService();
