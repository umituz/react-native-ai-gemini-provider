# Retry Service

Automatic retry mechanism with exponential backoff strategy. Handles transient errors gracefully.

## 📍 Import Path

```
import { geminiRetryService } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use this service to automatically retry failed operations with intelligent backoff. Handles network issues, rate limits, and transient server errors.

**When to use:**
- Wrap API calls that may fail transiently
- Handle rate limiting automatically
- Improve reliability of network operations
- Add resilience to critical operations
- Track retry attempts for monitoring

## 📌 Strategy

Not all errors should be retried. This service:
- Uses exponential backoff for delays
- Retries only transient errors (network, rate limit, server errors)
- Fails fast for permanent errors (auth, validation, safety)
- Provides retry callbacks for monitoring
- Configurable retry limits and delays

**Key Decision**: Only retry errors that might succeed on retry (429 rate limits, 5xx server errors, network issues). Never retry validation or authentication errors.

## ⚠️ Rules

### Usage Rules
- **MUST** wrap only retryable operations
- **SHOULD** configure appropriate max retries
- **MUST** handle final failure after all retries
- **SHOULD** use retry callbacks for monitoring
- **MUST NOT** retry non-idempotent operations without care

### Configuration Rules
- **MUST** set maxRetries appropriately (default: 3)
- **SHOULD** configure baseDelay for use case
- **MUST** set maxDelay to prevent excessive waits
- **SHOULD** use onRetry callback for logging

### Retryable Errors
- **WILL RETRY**: QUOTA_EXCEEDED, RATE_LIMIT, NETWORK, TIMEOUT, SERVER (5xx)
- **WILL NOT RETRY**: AUTHENTICATION, SAFETY, VALIDATION, MODEL_NOT_FOUND

### Error Handling Rules
- **MUST** catch and handle final errors
- **SHOULD** log retry attempts
- **MUST** differentiate retryable vs non-retryable errors
- **SHOULD** provide user feedback during retries

## 🤖 AI Agent Guidelines

### When Modifying This Service
1. **READ** the implementation file first
2. **UNDERSTAND** exponential backoff logic
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new functionality
5. **UPDATE** type definitions

### When Adding New Features
1. **CHECK** if similar feature exists
2. **FOLLOW** existing patterns
3. **USE** established error handling
4. **DOCUMENT** in type definitions
5. **ADD** examples to tests (not docs)

### When Fixing Bugs
1. **REPRODUCE** bug locally first
2. **IDENTIFY** root cause
3. **FIX** with minimal changes
4. **ADD** regression test
5. **VERIFY** all tests pass

### Code Style Rules
- **USE** async/await (no callbacks)
- **VALIDATE** inputs at function entry
- **THROW** typed errors (`GeminiError`)
- **LOG** retry attempts
- **COMMENT** complex logic only

## 📦 Available Methods

### `executeWithRetry(fn, options?)`

Execute function with automatic retry on transient errors.

**Refer to**: [`gemini-retry.service.ts`](./gemini-retry.service.ts)

## 🔗 Related Modules

- **Error Utilities**: [`ERROR_UTILITIES.md`](../infrastructure/utils/ERROR_UTILITIES.md)
- **Error Mapper**: [`ERROR_MAPPER.md`](../infrastructure/utils/ERROR_MAPPER.md)
- **Text Generation**: [`TEXT_GENERATION_SERVICE.md`](./TEXT_GENERATION_SERVICE.md)

## 📋 Configuration Reference

### RetryOptions

```typescript
interface RetryOptions {
  maxRetries?: number;    // Maximum retry attempts (default: 3)
  baseDelay?: number;     // Initial delay in ms (default: 1000)
  maxDelay?: number;      // Maximum delay in ms (default: 10000)
  onRetry?: (attempt: number, error: unknown) => void;
}
```

### Retryable Error Types
- `QUOTA_EXCEEDED`: Temporary quota exceeded
- `RATE_LIMIT`: Too many requests
- `NETWORK`: Network connectivity issues
- `TIMEOUT`: Request timeout
- `SERVER`: Server errors (5xx)

### Non-Retryable Error Types
- `AUTHENTICATION`: Invalid API key or credentials
- `SAFETY`: Content safety violation
- `VALIDATION`: Invalid request parameters
- `MODEL_NOT_FOUND`: Invalid model ID

## 🎓 Usage Patterns

### Basic Retry
1. Import service
2. Wrap async function in `executeWithRetry()`
3. Configure max retries and delays
4. Handle final success or failure
5. Provide user feedback

### With Callbacks
1. Import service
2. Configure `onRetry` callback
3. Log retry attempts for monitoring
4. Update UI with retry status
5. Track metrics for analytics

### Custom Configuration
1. Assess operation criticality
2. Set appropriate maxRetries (1-5)
3. Configure baseDelay for operation type
4. Set maxDelay to prevent excessive waits
5. Test retry behavior

### For Critical Operations
1. Use higher maxRetries (5+)
2. Use longer baseDelay (2000ms)
3. Set longer maxDelay (60000ms)
4. Implement detailed callbacks
5. Add timeout wrapper

## 🚨 Common Pitfalls

### Don't
- Retry authentication failures (won't succeed)
- Retry validation errors (need input fix)
- Retry without maxDelay (can wait forever)
- Retry non-idempotent operations carelessly
- Ignore retry callbacks (no visibility)

### Do
- Configure retries based on operation type
- Use callbacks for monitoring and analytics
- Set maxDelay to prevent excessive waits
- Handle non-retryable errors appropriately
- Differentiate transient vs permanent errors
- Consider timeouts for total operation time

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../AI_GUIDELINES.md)
