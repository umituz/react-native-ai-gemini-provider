/**
 * Retry Utilities
 * Implements retry logic with exponential backoff for resilient API calls
 */

import { measureAsync } from "./performance.util";

export interface RetryOptions {
  /** Maximum number of retry attempts */
  maxAttempts?: number;
  /** Initial delay in milliseconds */
  initialDelay?: number;
  /** Maximum delay in milliseconds */
  maxDelay?: number;
  /** Exponential backoff multiplier */
  backoffMultiplier?: number;
  /** Jitter factor to add randomness (0-1) */
  jitterFactor?: number;
  /** Whether to retry on specific error types */
  shouldRetry?: (error: unknown) => boolean;
}

export interface RetryResult<T> {
  result: T;
  attempts: number;
  totalDuration: number;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  jitterFactor: 0.1,
  shouldRetry: () => true,
};

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(
  attempt: number,
  options: Required<RetryOptions>
): number {
  const exponentialDelay = options.initialDelay * Math.pow(options.backoffMultiplier, attempt);

  // Apply jitter to prevent thundering herd
  const jitter = exponentialDelay * options.jitterFactor * (Math.random() * 2 - 1);

  return Math.min(
    Math.max(exponentialDelay + jitter, options.initialDelay),
    options.maxDelay
  );
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute operation with retry logic and exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };

  let lastError: unknown;

  for (let attempt = 0; attempt < opts.maxAttempts; attempt++) {
    try {
      const { result, duration } = await measureAsync(operation);

      return {
        result,
        attempts: attempt + 1,
        totalDuration: duration,
      };
    } catch (error) {
      lastError = error;

      // Check if we should retry this error
      if (!opts.shouldRetry(error)) {
        throw error;
      }

      // Don't delay after the last attempt
      if (attempt < opts.maxAttempts - 1) {
        const delay = calculateDelay(attempt, opts);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

/**
 * Create a retry predicate based on error type/message
 */
export function createRetryPredicate(
  retryablePatterns: string[]
): (error: unknown) => boolean {
  return (error: unknown) => {
    const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
    return retryablePatterns.some((pattern) => message.includes(pattern.toLowerCase()));
  };
}

/**
 * Default retry predicate for common retryable errors
 */
export const shouldRetryNetworkError = createRetryPredicate([
  "network",
  "timeout",
  "rate limit",
  "too many requests",
  "500",
  "502",
  "503",
  "504",
  "econnreset",
  "etimedout",
]);

/**
 * Retry only on specific conditions
 */
export async function retryIf<T>(
  operation: () => Promise<T>,
  shouldRetryFn: (error: unknown) => boolean,
  options?: Omit<RetryOptions, "shouldRetry">
): Promise<RetryResult<T>> {
  return retryWithBackoff(operation, {
    ...options,
    shouldRetry: shouldRetryFn,
  });
}

/**
 * Execute with fixed delay between attempts (no exponential backoff)
 */
export async function retryWithFixedDelay<T>(
  operation: () => Promise<T>,
  delay: number = 1000,
  maxAttempts: number = 3
): Promise<RetryResult<T>> {
  return retryWithBackoff(operation, {
    maxAttempts,
    initialDelay: delay,
    backoffMultiplier: 1,
    jitterFactor: 0,
  });
}
