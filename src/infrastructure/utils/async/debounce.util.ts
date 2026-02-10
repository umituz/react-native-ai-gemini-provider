/**
 * Debounced Async Utilities
 * Creates debounced versions of async functions with proper cancellation
 */

/**
 * Create a debounced async function with state management
 * Fixed to prevent race conditions when cancelled
 *
 * @example
 * ```ts
 * const debouncedFetch = createDebouncedAsync(fetchData, 300);
 * const result = await debouncedFetch.execute(id);
 * ```
 */
export function createDebouncedAsync<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  delay: number,
): {
  execute: (...args: Args) => Promise<T | null>;
  cancel: () => void;
  flush: () => void;
} {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let currentResolve: ((result: T | null) => void) | null = null;
  let isCancelled = false;

  const execute = (...args: Args): Promise<T | null> => {
    return new Promise((resolve) => {
      // Cancel any pending operation
      if (timeout) {
        clearTimeout(timeout);
        // Mark previous operation as cancelled
        isCancelled = true;
        // Resolve previous promise with null
        if (currentResolve) {
          currentResolve(null);
        }
      }

      // Store new resolver and reset cancelled flag
      currentResolve = resolve;
      isCancelled = false;

      timeout = setTimeout(() => {
        // Capture current resolve and reset it
        const resolveFn = currentResolve;
        currentResolve = null;

        // Check if this operation was cancelled before executing
        if (isCancelled) {
          resolveFn?.(null);
          return;
        }

        fn(...args)
          .then((result) => {
            // Only resolve if not cancelled
            if (!isCancelled && resolveFn) {
              resolveFn(result);
            }
          })
          .catch(() => {
            // Only resolve with null if not cancelled
            if (!isCancelled && resolveFn) {
              resolveFn(null);
            }
          })
          .finally(() => {
            timeout = undefined;
          });
      }, delay);
    });
  };

  const cancel = (): void => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    // Mark as cancelled and resolve pending promise
    isCancelled = true;
    if (currentResolve) {
      currentResolve(null);
      currentResolve = null;
    }
  };

  const flush = (): void => {
    if (timeout) {
      clearTimeout(timeout);
      // Don't resolve - just cancel
      timeout = undefined;
    }
    isCancelled = true;
    currentResolve = null;
  };

  return { execute, cancel, flush };
}
