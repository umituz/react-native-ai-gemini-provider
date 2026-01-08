# Cache Module

LRU (Least Recently Used) cache implementation. Used for performance optimization and cost savings.

## 📍 Import Path

```
import {
  SimpleCache,
  modelSelectionCache
} from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use cache to store expensive operation results and avoid redundant API calls. Improves performance and reduces costs.

**When to use:**
- Cache API responses
- Store model selection results
- Optimize expensive operations
- Reduce API calls
- Improve response times

## 📌 Strategy

Caching significantly improves performance. This module:
- Implements LRU eviction policy
- Supports TTL (time-to-live) for entries
- Provides type-safe caching
- Automatically expires stale entries
- Offers global and instance caching

**Key Decision**: Use `modelSelectionCache` for model selection. Create custom `SimpleCache` instances for specific use cases.

## ⚠️ Rules

### Usage Rules
- **MUST** configure appropriate cache size
- **SHOULD** set reasonable TTL values
- **MUST** handle cache misses gracefully
- **SHOULD** monitor cache hit rates
- **MUST NOT** cache everything indiscriminately

### Configuration Rules
- **MUST** set `maxSize` based on memory constraints
- **SHOULD** set `ttl` based on data freshness needs
- **MUST** consider cache entry size
- **SHOULD** invalidate stale data
- **MUST NOT** use excessive cache sizes

### Cache Key Rules
- **MUST** use descriptive cache keys
- **SHOULD** include relevant parameters in key
- **MUST NOT** use duplicate keys for different data
- **SHOULD** namespace keys appropriately
- **MUST** handle key collisions

### Error Handling Rules
- **MUST** handle cache failures gracefully
- **SHOULD** log cache errors in development
- **MUST** provide fallback on cache miss
- **SHOULD NOT** throw errors from cache operations
- **MUST** return data on cache miss

## 🤖 AI Agent Guidelines

### When Modifying Cache Module
1. **READ** existing cache implementation first
2. **UNDERSTAND** LRU eviction logic
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new functionality
5. **UPDATE** documentation

### When Adding New Caches
1. **CHECK** if similar cache exists
2. **FOLLOW** existing cache patterns
3. **USE** appropriate configuration
4. **DOCUMENT** cache purpose
5. **ADD** usage examples to tests

### When Optimizing Cache
1. **MEASURE** cache hit rates
2. **ADJUST** TTL values based on usage
3. **MONITOR** memory usage
4. **OPTIMIZE** cache size
5. **TEST** performance improvements

### Code Style Rules
- **USE** generic type parameters
- **VALIDATE** cache inputs
- **HANDLE** edge cases (null, undefined)
- **LOG** cache operations in development
- **COMMENT** complex logic only

## 📦 Available Caches

### SimpleCache

Generic LRU cache implementation.

**Refer to**: [`SimpleCache.ts`](./SimpleCache.ts)

**Methods:**
- `set(key, value, ttl?)` - Store value
- `get(key)` - Retrieve value
- `has(key)` - Check existence
- `delete(key)` - Remove entry
- `clear()` - Clear all entries
- `size()` - Get cache size
- `keys()` - Get all keys
- `getStats()` - Get statistics

### modelSelectionCache

Global cache for model selection results.

**Refer to**: [`index.ts`](./index.ts)

**Configuration:**
- `maxSize`: 50 entries
- `ttl`: 10 minutes
- Automatic model-feature mapping

## 🔗 Related Modules

- **Infrastructure README**: [`../infrastructure/README.md`](../infrastructure/README.md)
- **Services**: [`../services/README.md`](../services/README.md)
- **Performance Utils**: [`../utils/PERFORMANCE_UTILS.md`](../utils/PERFORMANCE_UTILS.md)

## 📋 Configuration Reference

### Cache Options

```typescript
interface CacheOptions {
  maxSize?: number;   // Maximum entries (default: 100)
  ttl?: number;       // Time-to-live in milliseconds (default: 5 minutes)
}
```

### Typical TTL Values

- **Hot data**: 30 seconds - 1 minute
- **Warm data**: 5 - 10 minutes
- **Cold data**: 30 - 60 minutes
- **Static data**: 1+ hours

### Cache Size Guidelines

- **Small cache**: 20-50 entries
- **Medium cache**: 100-200 entries
- **Large cache**: 500-1000 entries
- **Consider memory constraints**

## 🎓 Usage Patterns

### Basic Caching
1. Create `SimpleCache` instance
2. Configure size and TTL
3. Check cache before operation
4. Store result in cache
5. Handle cache hits and misses

### Model Selection Caching
1. Import `modelSelectionCache`
2. Check cache for feature-model mapping
3. Store selection in cache
4. Use cached model ID
5. Handle cache misses

### Cache Invalidation
1. Get all cache keys
2. Filter by pattern
3. Delete matching entries
4. Clear specific data
5. Update affected entries

### Multi-Level Caching
1. Create multiple cache instances
2. Use different TTL for each level
3. Check caches in order (fast to slow)
4. Promote data between levels
5. Handle multi-level misses

### Cache Monitoring
1. Call `getStats()` periodically
2. Calculate cache hit rate
3. Monitor memory usage
4. Adjust configuration based on metrics
5. Log performance data

## 🚨 Common Pitfalls

### Don't
- Cache everything indiscriminately
- Set excessive cache sizes
- Use very long TTL for dynamic data
- Forget to handle cache misses
- Cache sensitive or user-specific data without care

### Do
- Monitor cache hit rates
- Set appropriate TTL values
- Handle cache misses gracefully
- Clear cache periodically
- Use namespace prefixes for keys
- Consider memory constraints

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../AI_GUIDELINES.md)
