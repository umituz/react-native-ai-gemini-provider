# Infrastructure Layer

Performance optimization, monitoring, and extensibility features. Includes cache, telemetry, and interceptor mechanisms.

## 📍 Import Path

```
import {
  SimpleCache,
  modelSelectionCache,
  telemetryHooks,
  requestInterceptors,
  responseInterceptors
} from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use infrastructure features to optimize performance, monitor operations, and extend functionality. Provides caching, telemetry, and middleware capabilities.

**When to use:**
- Cache expensive operations
- Monitor AI operations
- Intercept requests/responses
- Optimize performance
- Track metrics
- Extend functionality

## 📌 Strategy

Infrastructure features are cross-cutting concerns. These systems:
- Improve performance through caching
- Enable observability through telemetry
- Provide extensibility through interceptors
- Support monitoring and debugging
- Optimize resource usage

**Key Decision**: Use infrastructure features to add capabilities without modifying core services. Keep infrastructure separate from business logic.

## ⚠️ Rules

### Usage Rules
- **MUST** initialize features before use
- **SHOULD** clean up resources appropriately
- **MUST** handle cache misses gracefully
- **SHOULD** monitor telemetry for insights
- **MUST NOT** create circular dependencies

### Cache Rules
- **MUST** set appropriate TTL values
- **SHOULD** monitor cache hit rates
- **MUST** handle cache size limits
- **SHOULD** invalidate stale data
- **MUST NOT** cache everything indiscriminately

### Telemetry Rules
- **SHOULD** subscribe to events early
- **MUST** unsubscribe when done
- **SHOULD NOT** emit sensitive data
- **MUST** handle listener errors
- **SHOULD** aggregate metrics

### Interceptor Rules
- **MUST** return modified context
- **SHOULD** handle errors in interceptors
- **MUST** unsubscribe when done
- **SHOULD NOT** block execution excessively
- **MUST** maintain order dependency

## 🤖 AI Agent Guidelines

### When Modifying Infrastructure
1. **READ** existing implementations first
2. **UNDERSTAND** feature dependencies
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new functionality
5. **UPDATE** documentation

### When Adding New Features
1. **CHECK** if similar feature exists
2. **FOLLOW** existing patterns
3. **USE** established error handling
4. **DOCUMENT** in code comments
5. **ADD** examples to tests (not docs)

### When Fixing Bugs
1. **REPRODUCE** bug locally first
2. **IDENTIFY** root cause
3. **FIX** with minimal changes
4. **ADD** regression test
5. **VERIFY** all tests pass

### Code Style Rules
- **USE** dependency injection
- **VALIDATE** inputs
- **HANDLE** errors gracefully
- **LOG** important operations
- **COMMENT** complex logic only

## 📦 Available Features

### Cache System

LRU cache implementation for performance optimization.

**Refer to**: [`cache/README.md`](./cache/README.md)

**Files:**
- [`cache/SimpleCache.ts`](./cache/SimpleCache.ts) - Cache implementation
- [`cache/index.ts`](./cache/index.ts) - Cache exports

### Telemetry System

Event-based monitoring for AI operations.

**Refer to**: [`telemetry/README.md`](./telemetry/README.md)

**Files:**
- [`telemetry/TelemetryHooks.ts`](./telemetry/TelemetryHooks.ts) - Telemetry implementation
- [`telemetry/index.ts`](./telemetry/index.ts) - Telemetry exports

### Interceptors

Middleware for request/response transformation.

**Refer to**: [`interceptors/README.md`](./interceptors/README.md)

**Files:**
- [`interceptors/RequestInterceptors.ts`](./interceptors/RequestInterceptors.ts) - Request interceptors
- [`interceptors/ResponseInterceptors.ts`](./interceptors/ResponseInterceptors.ts) - Response interceptors
- [`interceptors/index.ts`](./interceptors/index.ts) - Interceptor exports

## 🔗 Related Modules

- **Services**: [`services/README.md`](./services/README.md)
- **Utils**: [`utils/README.md`](./utils/README.md)
- **Domain Types**: [`../domain/README.md`](../domain/README.md)

## 📋 Feature Reference

### SimpleCache

LRU cache with TTL support.

**Methods:**
- `set(key, value, ttl?)` - Store value
- `get(key)` - Retrieve value
- `has(key)` - Check existence
- `delete(key)` - Remove entry
- `clear()` - Clear all entries
- `getStats()` - Get cache statistics

**Configuration:**
- `maxSize`: Maximum entries (default: 100)
- `ttl`: Time-to-live in milliseconds (default: 5 minutes)

### Telemetry Hooks

Event system for monitoring operations.

**Events:**
- `request` - Operation started
- `response` - Operation completed
- `error` - Operation failed
- `retry` - Retry attempted

**Methods:**
- `subscribe(listener)` - Add event listener
- `emit(event)` - Emit event
- `logRequest(model, feature)` - Log request start
- `logResponse(model, startTime, feature)` - Log response
- `logError(model, error, feature)` - Log error
- `clear()` - Clear all listeners

### Request Interceptors

Middleware for request transformation.

**Methods:**
- `use(interceptor)` - Add interceptor
- Returns unsubscribe function

**Execution Order:** First added runs first

### Response Interceptors

Middleware for response transformation.

**Methods:**
- `use(interceptor)` - Add interceptor
- Returns unsubscribe function

**Execution Order:** Last added runs first (reverse order)

## 🎓 Usage Patterns

### Caching Strategy
1. Import `SimpleCache` or use global cache
2. Configure cache size and TTL
3. Check cache before operation
4. Store result in cache after operation
5. Handle cache hits and misses

### Monitoring Setup
1. Subscribe to telemetry events early
2. Track metrics in event handler
3. Send to analytics/monitoring service
4. Aggregate and analyze metrics
5. Unsubscribe when done

### Request Interception
1. Add interceptor before operations
2. Modify request context
3. Return modified context
4. Clean up interceptor when done
5. Handle errors appropriately

### Response Interception
1. Add interceptor before operations
2. Process response data
3. Return modified context
4. Clean up interceptor when done
5. Handle errors appropriately

### Performance Optimization
1. Cache expensive operations
2. Monitor cache hit rates
3. Adjust TTL based on data freshness
4. Track operation durations
5. Optimize based on metrics

## 🚨 Common Pitfalls

### Don't
- Cache everything indiscriminately
- Forget to unsubscribe from events
- Block execution in interceptors
- Emit sensitive data in telemetry
- Create circular dependencies

### Do
- Set appropriate cache TTL values
- Monitor cache hit rates
- Clean up resources
- Keep interceptors lightweight
- Aggregate telemetry metrics
- Handle errors gracefully

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../AI_GUIDELINES.md)
