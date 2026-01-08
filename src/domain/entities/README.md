# Domain Entities

Core data structures and type definitions for the Gemini provider. Contains all types required for API communication.

## 📍 Import Path

```
import type {
  GeminiConfig,
  GeminiContent,
  GeminiResponse,
  GeminiImageGenerationResult,
  VideoGenerationResult,
  GeminiError,
  GeminiErrorType
} from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use these types for type-safe integration with Gemini services. Provides TypeScript interfaces for all API operations.

**When to use:**
- Type-check API requests and responses
- Define function signatures
- Validate data structures
- Understand API response formats
- Handle typed errors

## 📌 Strategy

Strong typing prevents runtime errors. These types:
- Define all API request/response structures
- Provide type safety for operations
- Enable autocomplete in IDEs
- Document API contracts
- Catch errors at compile time

**Key Decision**: All types defined in domain layer have NO external dependencies. This keeps them pure and reusable.

## ⚠️ Rules

### Usage Rules
- **MUST** use types from domain layer
- **SHOULD** prefer type imports over value imports
- **MUST** handle all error types
- **SHOULD** use type guards for validation
- **MUST NOT** use `any` type

### Type Safety Rules
- **MUST** define explicit return types
- **SHOULD** use strict null checks
- **MUST** validate runtime data
- **SHOULD** use discriminated unions for errors
- **MUST NOT** bypass type checking

### Error Handling Rules
- **MUST** catch and handle `GeminiError`
- **SHOULD** check error types
- **MUST** handle all error states
- **SHOULD** provide type-safe error messages
- **MUST NOT** ignore error types

## 🤖 AI Agent Guidelines

### When Modifying Types
1. **READ** existing type definitions first
2. **UNDERSTAND** type relationships
3. **MAINTAIN** backward compatibility
4. **UPDATE** all usages
5. **ADD** tests for new types

### When Adding New Types
1. **CHECK** if similar type exists
2. **FOLLOW** existing naming conventions
3. **USE** consistent patterns
4. **DOCUMENT** with JSDoc comments
5. **EXPORT** from index files

### When Fixing Type Bugs
1. **IDENTIFY** root cause in type definition
2. **FIX** with minimal changes
3. **UPDATE** all dependent code
4. **ADD** type tests
5. **VERIFY** no breaking changes

### Code Style Rules
- **USE** explicit type annotations
- **AVOID** `any` type
- **PREFER** readonly where appropriate
- **USE** discriminated unions
- **DOCUMENT** complex types

## 📦 Available Types

### Configuration Types

**GeminiConfig**: Client configuration

**Refer to**: [`gemini.types.ts`](./gemini.types.ts)

### Request/Response Types

**GeminiContent**: API request content structure

**GeminiResponse**: API response structure

**GeminiCandidate**: Generated candidate results

**Refer to**: [`gemini.types.ts`](./gemini.types.ts)

### Image Types

**GeminiImageGenerationResult**: Image generation result

**GeminiImageInput**: Image input structure

**Refer to**: [`gemini.types.ts`](./gemini.types.ts)

### Video Types

**VideoGenerationInput**: Video generation input

**VideoGenerationResult**: Video generation result

**VideoOperationStatus**: Operation status enum

**Refer to**: [`video.types.ts`](./video.types.ts)

### Error Types

**GeminiError**: Custom error class

**GeminiErrorType**: Error type enum

**GeminiErrorInfo**: Error information interface

**Refer to**: [`error.types.ts`](./error.types.ts)

### Model Types

**GeminiModel**: Model information

**GeminiGenerationConfig**: Generation parameters

**Refer to**: [`models.ts`](./models.ts)

## 🔗 Related Modules

- **Services**: [`../../infrastructure/services/README.md`](../../infrastructure/services/README.md)
- **Error Utilities**: [`../../infrastructure/utils/ERROR_UTILITIES.md`](../../infrastructure/utils/ERROR_UTILITIES.md)
- **Constants**: [`../constants/README.md`](../constants/README.md)

## 📋 Type Reference

### Finish Reason Types

Values indicating why generation completed:
- `STOP` - Normal completion
- `MAX_TOKENS` - Token limit reached
- `SAFETY` - Blocked by safety filter
- `RECITATION` - Copyright detected
- `OTHER` - Other reasons

### Video Operation Status

Operation lifecycle states:
- `queued` - Waiting in queue
- `processing` - Currently processing
- `completed` - Successfully finished
- `failed` - Operation failed

### Error Categories

Error types for handling:
- `API_ERROR` - General API errors
- `VALIDATION_ERROR` - Input validation errors
- `NETWORK_ERROR` - Network connectivity issues
- `TIMEOUT_ERROR` - Request timeout
- `RATE_LIMIT_ERROR` - Too many requests
- `PARSING_ERROR` - Response parsing failures
- `QUOTA_EXCEEDED` - API quota exceeded
- `AUTHENTICATION` - Invalid credentials
- `SAFETY` - Content safety violations
- `MODEL_NOT_FOUND` - Invalid model ID
- `SERVER` - Server errors (5xx)

## 🎓 Usage Patterns

### Type Imports
1. Import types from package
2. Use for function parameters
3. Define return types
4. Handle typed errors
5. Validate runtime data

### Error Type Checking
1. Catch error from operation
2. Check if `instanceof GeminiError`
3. Switch on error.type
4. Handle each error type appropriately
5. Provide user feedback

### Image Type Usage
1. Use `GeminiImageInput` for image data
2. Provide base64-encoded images
3. Specify MIME type
4. Handle image generation results
5. Extract image URL or base64

### Video Type Usage
1. Use `VideoGenerationInput` for requests
2. Monitor `VideoOperationStatus`
3. Handle progress updates
4. Extract video URL when complete
5. Handle errors appropriately

## 🚨 Common Pitfalls

### Don't
- Use `any` type to bypass typing
- Ignore error types
- Skip type validation
- Use hardcoded model IDs
- Forget to handle all error states

### Do
- Use explicit type annotations
- Check error types
- Validate runtime data
- Use type guards
- Handle all finish reasons
- Provide type-safe error messages

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../AI_GUIDELINES.md)
