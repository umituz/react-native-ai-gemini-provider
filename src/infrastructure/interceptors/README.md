# Interceptors Module

Middleware system for transforming requests and responses. Manages authentication, logging, transformation, and other cross-cutting concerns from a central location.

## 📍 Import Path

```
import {
  requestInterceptors,
  responseInterceptors
} from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use interceptors to modify API requests before sending and responses after receiving. Provides centralized middleware for authentication, logging, validation, caching, and data transformation.

**When to use:**
- Add authentication headers to requests
- Log and monitor API calls
- Transform request/response data
- Implement rate limiting
- Validate payloads
- Add custom headers
- Cache responses
- Handle errors globally
- Enrich response data

## 📌 Strategy

Interceptors provide a clean separation of concerns. This system:
- Executes request interceptors in order (first added runs first)
- Executes response interceptors in reverse order (last added runs first)
- Returns unsubscribe functions for cleanup
- Supports async interceptors
- Maintains immutability of context
- Enables composable middleware chains

**Key Decision**: Use interceptors for cross-cutting concerns. Keep business logic in services, use interceptors for operational concerns like logging, auth, and transformation.

## ⚠️ Rules

### Usage Rules
- **MUST** return modified context from interceptors
- **SHOULD** handle errors in interceptors gracefully
- **MUST** unsubscribe from interceptors when done
- **SHOULD NOT** block execution excessively
- **MUST** maintain execution order dependency

### Request Interceptor Rules
- **MUST** return RequestContext object
- **SHOULD** validate inputs in interceptors
- **MUST NOT** mutate original context directly
- **SHOULD** handle async operations properly
- **MUST NOT** throw errors from interceptors

### Response Interceptor Rules
- **MUST** return ResponseContext object
- **SHOULD** check for errors in responses
- **MUST NOT** expose sensitive data
- **SHOULD** transform data appropriately
- **MUST** handle undefined responses

### Best Practices Rules
- **SHOULD** add logging interceptor first
- **MUST** clean up interceptors on unmount
- **SHOULD NOT** create circular dependencies
- **MUST** return new context objects
- **SHOULD** keep interceptors lightweight

## 🤖 AI Agent Guidelines

### When Adding Interceptors
1. **READ** existing interceptor patterns first
2. **UNDERSTAND** execution order (request: FIFO, response: LIFO)
3. **IMPLEMENT** error handling
4. **RETURN** modified context
5. **TEST** interceptor in isolation

### When Removing Interceptors
1. **CALL** unsubscribe function
2. **VERIFY** no memory leaks
3. **UPDATE** dependent code
4. **TEST** after removal
5. **DOCUMENT** removal reason

### When Debugging Interceptors
1. **ADD** debug interceptor at start/end of chain
2. **LOG** context before/after modifications
3. **CHECK** execution order
4. **VERIFY** context immutability
5. **TEST** with various scenarios

### Code Style Rules
- **USE** async/await for async operations
- **RETURN** new context objects (spread operator)
- **HANDLE** errors with try-catch
- **LOG** important operations
- **COMMENT** complex transformation logic

## 📦 Available Interceptors

### Request Interceptors

**Refer to**: [`RequestInterceptors.ts`](./RequestInterceptors.ts)

**Methods:**
- `use(interceptor)` - Add interceptor
- `apply(context)` - Apply all interceptors
- `clear()` - Clear all interceptors
- `count()` - Get interceptor count

**Execution Order:** First added runs first (FIFO)

### Response Interceptors

**Refer to**: [`ResponseInterceptors.ts`](./ResponseInterceptors.ts)

**Methods:**
- `use(interceptor)` - Add interceptor
- `apply(context)` - Apply all interceptors
- `clear()` - Clear all interceptors
- `count()` - Get interceptor count

**Execution Order:** Last added runs first (LIFO)

## 🔗 Related Modules

- **Infrastructure README**: [`../infrastructure/README.md`](../infrastructure/README.md)
- **Services**: [`../services/README.md`](../services/README.md)
- **Telemetry**: [`../telemetry/README.md`](../telemetry/README.md)

## 📋 Interceptor Patterns

### Authentication Pattern
1. Add interceptor before operations
2. Inject API key/token into context
3. Return modified context
4. Handle missing credentials
5. Clean up interceptor when done

### Logging Pattern
1. Add interceptor at start of chain
2. Log request/response details
3. Include timing information
4. Return context unchanged
5. Avoid logging sensitive data

### Transformation Pattern
1. Add interceptor for specific transformation
2. Extract data from context
3. Apply transformation logic
4. Return new context with transformed data
5. Handle transformation errors

### Caching Pattern
1. Add response interceptor
2. Check response status
3. Cache successful responses
4. Return context unchanged
5. Handle cache errors gracefully

### Validation Pattern
1. Add request interceptor
2. Validate context payload
3. Check required fields
4. Throw on validation failure
5. Return context if valid

## 🎓 Usage Patterns

### Request Interception
1. Import `requestInterceptors`
2. Call `use()` with interceptor function
3. Modify and return RequestContext
4. Store unsubscribe function
5. Call unsubscribe on cleanup

### Response Interception
1. Import `responseInterceptors`
2. Call `use()` with interceptor function
3. Modify and return ResponseContext
4. Store unsubscribe function
5. Call unsubscribe on cleanup

### Chained Interceptors
1. Add interceptors in desired order
2. Request: First added runs first
3. Response: Last added runs first
4. Store all unsubscribe functions
5. Clean up all on unmount

### Conditional Interceptors
1. Check environment/conditions
2. Add interceptor only if needed
3. Return early from interceptor if not applicable
4. Keep conditional logic simple
5. Test both conditional paths

### Async Interceptors
1. Make interceptor function async
2. Use await for async operations
3. Handle async errors
4. Return modified context
5. Test async behavior

## 🚨 Common Pitfalls

### Don't
- Mutate original context object
- Forget to unsubscribe from interceptors
- Block execution with heavy operations
- Throw errors from interceptors
- Create circular dependencies between interceptors

### Do
- Return new context objects
- Clean up interceptors when done
- Keep interceptors lightweight
- Handle errors gracefully
- Follow execution order rules

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
