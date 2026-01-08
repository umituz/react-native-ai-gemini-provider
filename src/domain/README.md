# Domain Layer

Core type definitions and constants for the Gemini provider. Contains data structures and constants independent of business logic.

## 📍 Import Path

```
import type {
  GeminiConfig,
  GeminiGenerationConfig,
  GeminiResponse,
  GeminiImageGenerationResult,
  VideoGenerationResult,
  GeminiError,
  GeminiErrorType
} from '@umituz/react-native-ai-gemini-provider';

import {
  GEMINI_MODELS,
  DEFAULT_MODELS,
  getGeminiImageFeatureModel,
  getGeminiVideoFeatureModel
} from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use this layer for type-safe integration with Gemini services. Provides TypeScript interfaces and constants for all operations.

**When to use:**
- Type-check API requests and responses
- Access model constants and configurations
- Define function signatures
- Understand data structures
- Handle typed errors

## 📌 Strategy

Domain layer contains NO business logic or external dependencies. These definitions:
- Provide pure type definitions
- Define constant values
- Enable compile-time type checking
- Document API contracts
- Remain stable despite code changes

**Key Decision**: All domain types have NO external dependencies. This keeps them pure, reusable, and testable.

## ⚠️ Rules

### Usage Rules
- **MUST** use types from domain layer
- **SHOULD** use type imports over value imports
- **MUST** handle all defined error types
- **SHOULD** use constants instead of hardcoded values
- **MUST NOT** use `any` type

### Type Safety Rules
- **MUST** define explicit return types
- **SHOULD** use strict null checks
- **MUST** validate runtime data
- **SHOULD** use discriminated unions for errors
- **MUST NOT** bypass type checking

### Constants Rules
- **MUST** use defined model constants
- **SHOULD** use helper functions for model selection
- **MUST NOT** hardcode model IDs
- **SHOULD** prefer constants over magic strings
- **MUST** use valid model IDs from constants

## 🤖 AI Agent Guidelines

### When Modifying Domain Types
1. **READ** existing type definitions first
2. **UNDERSTAND** type relationships
3. **MAINTAIN** backward compatibility
4. **UPDATE** all dependent code
5. **ADD** tests for new types

### When Adding New Types
1. **CHECK** if similar type exists
2. **FOLLOW** existing naming conventions
3. **USE** consistent patterns
4. **DOCUMENT** with JSDoc comments
5. **EXPORT** from index files

### When Adding Constants
1. **CHECK** if constant already exists
2. **USE** descriptive names
3. **GROUP** related constants
4. **PROVIDE** helper functions
5. **DOCUMENT** constant values

### Code Style Rules
- **USE** explicit type annotations
- **AVOID** `any` type
- **PREFER** readonly where appropriate
- **USE** discriminated unions
- **DOCUMENT** complex types

## 📦 Available Modules

### Type Definitions

**Entities**: Core data structures

**Refer to**: [`entities/README.md`](./entities/README.md)

**Files:**
- [`entities/gemini.types.ts`](./entities/gemini.types.ts) - Main Gemini types
- [`entities/error.types.ts`](./entities/error.types.ts) - Error types
- [`entities/models.ts`](./entities/models.ts) - Model definitions
- [`entities/video.types.ts`](./entities/video.types.ts) - Video types

### Constants

**Feature Models**: Model mappings for features

**Refer to**: [`constants/README.md`](./constants/README.md)

**Files:**
- [`constants/feature-models.constants.ts`](./constants/feature-models.constants.ts) - Feature model mappings
- [`constants/models.constants.ts`](./constants/models.constants.ts) - Model constants

## 🔗 Related Modules

- **Services**: [`../infrastructure/services/README.md`](../infrastructure/services/README.md)
- **Infrastructure**: [`../infrastructure/README.md`](../infrastructure/README.md)
- **Providers**: [`../providers/README.md`](../providers/README.md)

## 📋 Type Reference

### Configuration Types

**GeminiConfig**: Client configuration
- `apiKey`: string (required)
- `baseUrl`: string (optional)
- `maxRetries`: number (optional)
- Various model IDs (optional)

**GeminiGenerationConfig**: Generation parameters
- Compatible with Google SDK
- Temperature, topP, topK, maxOutputTokens
- Response schema

### Request/Response Types

**GeminiContent**: API request structure
- `parts`: Array of text, inline data, or file data
- `role`: "user" | "model"

**GeminiResponse**: API response structure
- `candidates`: Generated results
- `promptFeedback`: Prompt feedback
- `usageMetadata`: Token usage

### Error Types

**GeminiError**: Custom error class
- Extends Error
- Includes error type and original error

**GeminiErrorType**: Error categories
- API_ERROR, VALIDATION_ERROR, NETWORK_ERROR
- TIMEOUT_ERROR, RATE_LIMIT_ERROR, PARSING_ERROR
- QUOTA_EXCEEDED, AUTHENTICATION, SAFETY
- MODEL_NOT_FOUND, SERVER

### Model Constants

**GEMINI_MODELS**: All supported models
- Text models (gemini-2.5-flash-lite, gemini-2.5-pro, etc.)
- Image models (imagen-4.0-generate-001, etc.)
- Video models (veo-3.1-fast-generate-preview, etc.)

**DEFAULT_MODELS**: Default model selections
- TEXT: gemini-2.5-flash-lite
- TEXT_TO_IMAGE: imagen-4.0-generate-001
- IMAGE_EDIT: gemini-2.5-flash-image
- VIDEO_GENERATION: veo-3.1-fast-generate-preview

## 🎓 Usage Patterns

### Type Imports
1. Import types from package
2. Use for function parameters
3. Define return types
4. Handle typed errors
5. Validate runtime data

### Model Selection
1. Import model constants
2. Use helper functions for feature-based selection
3. Get model ID for specific feature
4. Use returned ID in service calls
5. Avoid hardcoded model strings

### Error Handling
1. Catch error from operation
2. Check if `instanceof GeminiError`
3. Switch on error.type
4. Handle each error type appropriately
5. Provide user feedback

### Configuration
1. Create config object
2. Use types for validation
3. Specify model IDs from constants
4. Include retry and timeout settings
5. Initialize provider with config

## 🚨 Common Pitfalls

### Don't
- Use `any` type to bypass typing
- Hardcode model IDs
- Ignore error types
- Skip runtime validation
- Use magic strings

### Do
- Use explicit type annotations
- Import constants for model IDs
- Check error types
- Validate runtime data
- Use helper functions
- Define proper interfaces

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../AI_GUIDELINES.md)
