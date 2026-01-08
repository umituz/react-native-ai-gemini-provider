# Error Mapper Utility

Maps Gemini API errors to standardized error types with retry information. Provides consistent error categorization.

## 📍 Import Path

```
import {
  mapGeminiError,
  isGeminiErrorRetryable,
  categorizeGeminiError
} from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use error mapper to categorize and handle Gemini API errors consistently. Provides retry information and error types.

**When to use:**
- Categorize API errors
- Determine retry eligibility
- Handle error responses
- Implement retry logic
- Provide user feedback

## 📌 Strategy

Consistent error handling improves reliability. This utility:
- Maps errors to standard types
- Provides retry information
- Categorizes errors appropriately
- Includes status codes
- Simplifies error handling

**Key Decision**: Always map errors before handling. Provides consistent error information across the application.

## ⚠️ Rules

### Error Mapping Rules
- **MUST** map all API errors
- **SHOULD** check retry status
- **MUST** handle unknown errors
- **SHOULD** preserve error context
- **MUST NOT** expose sensitive data

### Retry Rules
- **SHOULD** retry retryable errors
- **MUST** implement backoff
- **SHOULD** set retry limits
- **MUST NOT** retry non-retryable errors
- **SHOULD** track retry attempts

### Categorization Rules
- **MUST** use correct error type
- **SHOULD** check error category
- **MUST** handle all categories
- **SHOULD** provide context
- **MUST NOT** miscategorize errors

### Error Handling Rules
- **MUST** catch and map errors
- **SHOULD** log error details
- **MUST** inform user appropriately
- **SHOULD** provide recovery options
- **MUST NOT** suppress errors

## 🤖 AI Agent Guidelines

### When Mapping Errors
1. **CATCH** API error
2. **CALL** mapGeminiError()
3. **GET** error information
4. **CHECK** retry status
5. **HANDLE** appropriately

### When Checking Retry Eligibility
1. **CALL** isGeminiErrorRetryable()
2. **CHECK** return value
3. **RETRY** if true
4. **FAIL** if false
5. **IMPLEMENT** backoff

### When Categorizing Errors
1. **CALL** categorizeGeminiError()
2. **GET** error type
3. **SWITCH** on category
4. **HANDLE** each case
5. **PROVIDE** user feedback

### Code Style Rules
- **MAP** all errors consistently
- **CHECK** retry before retrying
- **HANDLE** all error types
- **PROVIDE** clear messages
- **LOG** error information

## 📦 Available Functions

**Refer to**: [`error-mapper.util.ts`](./error-mapper.util.ts)

### Error Mapping
- `mapGeminiError(error)` - Map error to GeminiErrorInfo
- `isGeminiErrorRetryable(error)` - Check if error is retryable
- `categorizeGeminiError(error)` - Categorize error type

## 🔗 Related Modules

- **Error Utilities**: [`./ERROR_UTILITIES.md`](./ERROR_UTILITIES.md)
- **Retry Service**: [`../services/RETRY_SERVICE.md`](../services/RETRY_SERVICE.md)
- **Domain Types**: [`../../domain/README.md`](../../domain/README.md)

## 📋 Error Categories

### Retryable Errors
- `QUOTA_EXCEEDED` - API quota exceeded
- `RATE_LIMIT` - Rate limit hit
- `NETWORK` - Network error
- `TIMEOUT` - Request timeout
- `SERVER` - Server error (5xx)

### Non-Retryable Errors
- `AUTHENTICATION` - Invalid credentials
- `SAFETY` - Safety filter triggered
- `MODEL_NOT_FOUND` - Invalid model
- `VALIDATION` - Invalid request
- `UNKNOWN` - Unknown error

## 🎓 Usage Patterns

### Error Handling
1. Catch API error
2. Map to GeminiError
3. Check retryable status
4. Retry or fail appropriately
5. Provide user feedback

### Retry Logic
1. Check isGeminiErrorRetryable()
2. If true, implement retry
3. Use exponential backoff
4. Set retry limit
5. Fail after max retries

### Error Categorization
1. Call categorizeGeminiError()
2. Get error type
3. Switch on type
4. Handle each case
5. Provide specific feedback

## 🚨 Common Pitfalls

### Don't
- Skip error mapping
- Retry without checking
- Ignore error types
- Suppress errors
- Expose sensitive data

### Do
- Always map errors
- Check retry status
- Handle all categories
- Provide clear feedback
- Log error details

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
