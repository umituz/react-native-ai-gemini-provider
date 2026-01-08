# Video Error Handler Service

Factory for creating typed video generation errors with retry information. Provides consistent error handling for video generation operations.

## 📍 Import Path

```
import { createVideoError } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use video error handler to create typed errors for video generation failures. Provides consistent error handling with retry information.

**When to use:**
- Create video generation errors
- Determine retry behavior
- Handle video operation failures
- Provide consistent error messages
- Categorize error types

## 📌 Strategy

Typed errors improve error handling. This service:
- Categorizes error types
- Provides retry information
- Creates consistent error objects
- Includes status codes
- Simplifies error handling

**Key Decision**: Always use createVideoError for video failures. Provides consistent error handling across video operations.

## ⚠️ Rules

### Error Creation Rules
- **MUST** specify error type
- **SHOULD** provide clear messages
- **MUST** include context information
- **SHOULD** set retry flag correctly
- **MUST NOT** expose sensitive data

### Error Type Rules
- **MUST** use appropriate error type
- **SHOULD** distinguish retryable errors
- **MUST** match error to situation
- **SHOULD** provide status codes
- **MUST NOT** use unknown type unnecessarily

### Retry Rules
- **SHOULD** retry NETWORK errors
- **SHOULD** retry TIMEOUT errors
- **MUST NOT** retry VALIDATION errors
- **SHOULD NOT** retry QUOTA errors
- **MUST** implement backoff for retries

### Error Handling Rules
- **MUST** catch all video errors
- **SHOULD** log error details
- **MUST** inform user appropriately
- **SHOULD** provide recovery options
- **MUST NOT** suppress errors

## 🤖 AI Agent Guidelines

### When Creating Errors
1. **IDENTIFY** error type
2. **CREATE** error with createVideoError()
3. **INCLUDE** relevant context
4. **SET** retry flag appropriately
5. **THROW** or return error

### When Handling Errors
1. **CATCH** video generation errors
2. **CHECK** error type
3. **DETERMINE** retry eligibility
4. **INFORM** user appropriately
5. **PROVIDE** recovery options

### When Implementing Retries
1. **CHECK** error.retryable flag
2. **IMPLEMENT** exponential backoff
3. **SET** retry limit
4. **LOG** retry attempts
5. **FAIL** after max retries

### Code Style Rules
- **USE** typed error creation
- **PROVIDE** clear error messages
- **INCLUDE** relevant context
- **HANDLE** all error types
- **LOG** error information

## 📦 Available Function

### createVideoError

**Refer to**: [`gemini-video-error.ts`](./gemini-video-error.ts)

**Parameters:**
- `type`: VideoGenerationErrorType - Error category
- `message`: string - Human-readable error message
- `statusCode?`: number - HTTP status code

**Returns:** VideoGenerationError

## 🔗 Related Modules

- **Video Generation**: [`VIDEO_GENERATION_SERVICE.md`](./VIDEO_GENERATION_SERVICE.md)
- **Error Utilities**: [`../utils/ERROR_UTILITIES.md`](../utils/ERROR_UTILITIES.md)
- **Retry Service**: [`RETRY_SERVICE.md`](./RETRY_SERVICE.md)

## 📋 Error Types

### NETWORK
Network-related errors (retryable)

### TIMEOUT
Request timeout (retryable)

### API
API-level errors (may be retryable)

### VALIDATION
Input validation errors (not retryable)

### QUOTA
Quota/rate limit errors (not retryable)

### UNKNOWN
Uncategorized errors

### Retry Behavior

| Error Type | Retryable | Description |
|------------|-----------|-------------|
| NETWORK | Yes | Transient network issues |
| TIMEOUT | Yes | Request timeouts |
| API | Maybe | API-specific errors |
| VALIDATION | No | Invalid input |
| QUOTA | No | Rate limit exceeded |
| UNKNOWN | Maybe | Uncategorized errors |

## 🎓 Usage Patterns

### Error Creation
1. Identify error type
2. Call createVideoError()
3. Provide message and status
4. Include context
5. Throw or return error

### Error Handling
1. Catch video errors
2. Check error type
3. Determine retry eligibility
4. Handle appropriately
5. Inform user

### Retry Logic
1. Check error.retryable
2. Implement backoff
3. Set retry limit
4. Log attempts
5. Fail after max retries

## 🚨 Common Pitfalls

### Don't
- Use generic errors
- Skip error type specification
- Ignore retry flag
- Expose sensitive data
- Suppress errors

### Do
- Use typed error creation
- Specify error type correctly
- Check retry flag
- Provide clear messages
- Handle all error cases

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
