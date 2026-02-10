/**
 * Memoized Async Utilities
 * Creates memoized versions of async functions with TTL-based caching
 */

/**
 * Create a memoized async function with cache TTL
 *
 * @example
 * ```ts
 * const memoizedFetch = createMemoizedAsync(fetchData, 5000);
 * const result1 = await memoizedFetch.execute(id); // Fetches
 * const result2 = await memoizedFetch.execute(id); // Uses cache
 * memoizedFetch.invalidate(id); // Clears cache for this id
 * ```
 */
export function createMemoizedAsync<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  ttl: number = 5000,
): {
  execute: (...args: Args) => Promise<T>;
  invalidate: (...args: Args) => void;
  clear: () => void;
} {
  const cache = new Map<string, { data: T; timestamp: number }>();

  const generateKey = (args: Args): string => {
    return JSON.stringify(args);
  };

  const execute = async (...args: Args): Promise<T> => {
    const key = generateKey(args);
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    const result = await fn(...args);
    cache.set(key, { data: result, timestamp: Date.now() });

    return result;
  };

  const invalidate = (...args: Args): void => {
    const key = generateKey(args);
    cache.delete(key);
  };

  const clear = (): void => {
    cache.clear();
  };

  return { execute, invalidate, clear };
}
