/**
 * Simple LRU Cache
 * Least Recently Used cache for performance optimization
 */

declare const __DEV__: boolean;

interface CacheEntry<V> {
  value: V;
  expiresAt: number;
}

export interface CacheOptions {
  maxSize?: number;
  ttl?: number; // Time to live in milliseconds
}

export class SimpleCache<K, V> {
  private cache = new Map<K, CacheEntry<V>>();
  private maxSize: number;
  private ttl: number;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize ?? 100;
    this.ttl = options.ttl ?? 5 * 60 * 1000; // 5 minutes default
  }

  /**
   * Set a value in the cache
   */
  set(key: K, value: V, customTtl?: number): void {
    // Remove oldest entry if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    const ttl = customTtl ?? this.ttl;
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  /**
   * Get a value from the cache
   * Returns undefined if not found or expired
   */
  get(key: K): V | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Delete a specific key
   */
  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get current cache size
   */
  size(): number {
    // Clean expired entries first
    this.cleanExpired();
    return this.cache.size;
  }

  /**
   * Remove all expired entries
   */
  private cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get all valid keys (not expired)
   */
  keys(): K[] {
    this.cleanExpired();
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    keys: K[];
  } {
    return {
      size: this.size(),
      maxSize: this.maxSize,
      keys: this.keys(),
    };
  }
}

/**
 * Global model selection cache
 * Caches model IDs for features to avoid repeated lookups
 */
class ModelSelectionCache {
  private cache = new SimpleCache<string, string>({
    maxSize: 50,
    ttl: 10 * 60 * 1000, // 10 minutes
  });

  set(feature: string, model: string): void {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[ModelSelectionCache] Caching model:", { feature, model });
    }
    this.cache.set(feature, model);
  }

  get(feature: string): string | undefined {
    const model = this.cache.get(feature);
    if (model && typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[ModelSelectionCache] Cache hit:", { feature, model });
    }
    return model;
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): ReturnType<SimpleCache<string, string>["getStats"]> {
    return this.cache.getStats();
  }
}

export const modelSelectionCache = new ModelSelectionCache();
