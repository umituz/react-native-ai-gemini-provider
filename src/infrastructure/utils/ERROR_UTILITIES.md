# Error Utilities

Utilities for managing and standardizing Gemini API errors. Provides error categorization, retry detection, and user-friendly messaging.

## 📍 Import Path

```
import {
  mapGeminiError,
  isGeminiErrorRetryable,
  categorizeGeminiError,
  createGeminiError
} from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use these utilities to handle Gemini API errors consistently. Provides error categorization, retry logic, and user-friendly messaging.

**When to use:**
- Categorize API errors by type
- Determine if errors are retryable
- Create user-friendly error messages
- Implement retry logic
- Log errors for monitoring

## 📌 Strategy

Consistent error handling improves UX and debugging. These utilities:
- Categorize errors into standard types
- Identify retryable vs non-retryable errors
- Provide structured error information
- Enable intelligent retry logic
- Support error analytics and monitoring

**Key Decision**: Use error categorization to determine retry logic. Only retry transient errors (network, rate limit, server errors), not permanent errors (auth, validation, safety).

## ⚠️ Rules

### Usage Rules
- **MUST** categorize errors before handling
- **SHOULD** check retryable status before retrying
- **MUST** provide user-friendly messages
- **SHOULD** log errors for debugging
- **MUST NOT** expose API keys in errors

### Error Handling Rules
- **MUST** use `isGeminiErrorRetryable()` before retrying
- **SHOULD** use `categorizeGeminiError()` for error handling
- **MUST** handle permanent errors appropriately (no retry)
- **SHOULD** implement user-friendly error messages
- **MUST** log errors with full context

### Retry Rules
- **WILL RETRY**: QUOTA_EXCEEDED, RATE_LIMIT, NETWORK, TIMEOUT, SERVER (5xx)
- **WILL NOT RETRY**: AUTHENTICATION, SAFETY, VALIDATION, MODEL_NOT_FOUND

## 🤖 AI Agent Guidelines

### When Modifying These Utilities
1. **READ** the implementation file first
2. **UNDERSTAND** error patterns
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new error patterns
5. **UPDATE** type definitions

### When Adding New Features
1. **CHECK** if similar error handling exists
2. **FOLLOW** existing patterns
3. **ADD** new error patterns to mapper
4. **DOCUMENT** in type definitions
5. **ADD** examples to tests (not docs)

### When Fixing Bugs
1. **REPRODUCE** bug locally first
2. **IDENTIFY** root cause
3. **FIX** with minimal changes
4. **ADD** regression test
5. **VERIFY** all tests pass

### Code Style Rules
- **VALIDATE** error inputs
- **THROW** typed errors (`GeminiError`)
- **LOG** error categorization
- **COMMENT** complex pattern matching
- **USE** consistent error types

## 📦 Available Functions

### `mapGeminiError(error)`

Convert Gemini API errors to standard format.

**Refer to**: [`error-mapper.util.ts`](./error-mapper.util.ts)

### `isGeminiErrorRetryable(error)`

Check if error is retryable.

**Refer to**: [`error-mapper.util.ts`](./error-mapper.util.ts)

### `categorizeGeminiError(error)`

Determine error category.

**Refer to**: [`error-mapper.util.ts`](./error-mapper.util.ts)

### `createGeminiError(error)`

Create `GeminiError` instance.

**Refer to**: [`error-mapper.util.ts`](./error-mapper.util.ts)

## 🔗 Related Modules

- **Error Types**: [`domain/entities/error.types.ts`](../domain/entities/error.types.ts)
- **Retry Service**: [`RETRY_SERVICE.md`](../infrastructure/services/RETRY_SERVICE.md)
- **Error Mapper**: [`ERROR_MAPPER.md`](./ERROR_MAPPER.md)

## 📋 Configuration Reference

### GeminiErrorType Categories

| Error Type | Description | Retry | Example Message |
|------------|-------------|-------|-----------------|
| `QUOTA_EXCEEDED` | Quota exceeded | ✅ | "Quota exceeded" |
| `RATE_LIMIT` | Rate limit | ✅ | "Too many requests" |
| `AUTHENTICATION` | Authentication failed | ❌ | "Invalid API key" |
| `SAFETY` | Safety blocked | ❌ | "Content blocked" |
| `MODEL_NOT_FOUND` | Model not found | ❌ | "Model not found" |
| `NETWORK` | Network error | ✅ | "Network error" |
| `TIMEOUT` | Request timeout | ✅ | "Request timeout" |
| `SERVER` | Server error (5xx) | ✅ | "Internal server error" |
| `VALIDATION` | Validation error | ❌ | "Invalid request" |
| `UNKNOWN` | Unknown error | ❌ | "Unknown error" |

### Error Patterns

Error mapper searches for these patterns in error messages:
- **Quota**: "quota", "resource exhausted", "429"
- **Rate Limit**: "rate limit", "too many requests"
- **Auth**: "unauthorized", "invalid api key", "401", "403"
- **Safety**: "safety", "blocked", "harmful"
- **Not Found**: "model not found", "404"
- **Network**: "network", "fetch failed", "connection"
- **Timeout**: "timeout", "timed out"
- **Server**: "500", "502", "503", "504", "internal server"
- **Validation**: "invalid", "bad request", "400"

## 🎓 Usage Patterns

### Retry Logic
1. Catch error from API call
2. Check `isGeminiErrorRetryable()`
3. If retryable and max retries not reached, retry with backoff
4. If non-retryable or max retries reached, handle error
5. Provide user feedback

### Error Categorization
1. Catch error from operation
2. Call `categorizeGeminiError()` to get error type
3. Switch on error type for handling
4. Show appropriate user message per type
5. Log error with full context

### User-Friendly Messages
1. Categorize error using `categorizeGeminiError()`
2. Map error type to user-friendly message
3. Display message to user
4. Provide actionable next steps when possible
5. Log technical details separately

### Error Analytics
1. Categorize each error
2. Track error counts by type
3. Calculate error rates
4. Send to analytics service
5. Monitor error trends

### Conditional Retry
1. Attempt operation
2. On error, check if retryable
3. If retryable, calculate backoff delay
4. Wait for backoff period
5. Retry operation or fail after max attempts

## 🚨 Common Pitfalls

### Don't
- Retry non-retryable errors (auth, validation, safety)
- Show technical error messages to users
- Ignore error categorization
- Forget to log errors
- Expose API keys in error messages

### Do
- Always check error type before handling
- Use retryable status for retry logic
- Provide user-friendly messages
- Log errors with full context
- Track errors for analytics
- Implement exponential backoff for retries
- Handle permanent errors appropriately

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../AI_GUIDELINES.md)
