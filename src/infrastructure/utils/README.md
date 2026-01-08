# Utils

Utility functions and tools for Gemini provider. Handles error management, performance monitoring, data transformation, model validation, image preparation, and input building.

## 📍 Import Path

```
import {
  // Error handling
  mapGeminiError,
  isGeminiErrorRetryable,
  categorizeGeminiError,
  createGeminiError,

  // Model validation
  isValidModel,
  validateModel,
  getSafeModel,
  getModelCategory,
  getAllValidModels,

  // Performance
  measureAsync,
  measureSync,
  debounce,
  throttle,
  performanceTracker,

  // Data transformation
  extractBase64Data,
  extractTextFromResponse,

  // Image preparation
  prepareImageFromUri,
  prepareImage,
  isValidBase64,

  // Input builders
  buildUpscaleInput,
  buildPhotoRestoreInput,
  buildRemoveBackgroundInput,
  buildReplaceBackgroundInput
} from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use utility functions for common operations across the provider. Provides error handling, validation, performance monitoring, and data transformation capabilities.

**When to use:**
- Validate model IDs
- Handle API errors
- Monitor performance
- Transform data formats
- Prepare images for processing
- Build complex inputs
- Measure operation duration
- Debounce/throttle functions

## 📌 Strategy

Utilities provide reusable, composable functions. This system:
- Separates concerns from business logic
- Provides consistent error handling
- Enables performance monitoring
- Simplifies data transformations
- Validates inputs centrally
- Builds complex inputs from simple data

**Key Decision**: Use utility functions for cross-cutting concerns. Keep services focused on business logic, use utils for operational tasks.

## ⚠️ Rules

### Error Handling Rules
- **MUST** catch and categorize all API errors
- **SHOULD** use typed GeminiError instances
- **MUST** check retryable status before retrying
- **SHOULD** log errors appropriately
- **MUST NOT** expose sensitive data in errors

### Model Validation Rules
- **MUST** validate model IDs before use
- **SHOULD** use safe fallbacks for invalid models
- **MUST** check model category for features
- **SHOULD** validate early in request flow
- **MUST NOT** allow arbitrary model IDs

### Performance Rules
- **SHOULD** measure critical operations
- **MUST** track performance metrics
- **SHOULD** use debounce/throttle for frequent calls
- **MUST NOT** impact performance with monitoring
- **SHOULD** aggregate metrics over time

### Data Transformation Rules
- **MUST** validate input data format
- **SHOULD** handle edge cases (null, undefined)
- **MUST** sanitize sensitive information
- **SHOULD** preserve data integrity
- **MUST** handle transformation errors

### Image Preparation Rules
- **MUST** validate base64 format
- **SHOULD** handle different image formats
- **MUST** extract MIME type correctly
- **SHOULD** handle large images efficiently
- **MUST** validate image data

## 🤖 AI Agent Guidelines

### When Handling Errors
1. **CATCH** errors from API calls
2. **MAP** to GeminiError using mapGeminiError()
3. **CHECK** if retryable using isGeminiErrorRetryable()
4. **CATEGORIZE** error type
5. **HANDLE** appropriately (retry or fail)

### When Validating Models
1. **CHECK** model validity with isValidModel()
2. **GET** safe model with getSafeModel()
3. **DETERMINE** model category
4. **VALIDATE** category supports feature
5. **USE** validated model in requests

### When Measuring Performance
1. **WRAP** operation with measureAsync()
2. **RECORD** duration with performanceTracker
3. **ANALYZE** metrics periodically
4. **IDENTIFY** slow operations
5. **OPTIMIZE** based on data

### When Preparing Images
1. **VALIDATE** image source (URI or base64)
2. **EXTRACT** base64 data if needed
3. **DETERMINE** MIME type
4. **PREPARE** image object
5. **HANDLE** preparation errors

### Code Style Rules
- **USE** appropriate utility for each task
- **VALIDATE** inputs early
- **HANDLE** all error cases
- **LOG** important operations
- **COMMENT** complex transformations

## 📦 Available Utilities

### Error Management

**Refer to**: [`ERROR_UTILITIES.md`](./ERROR_UTILITIES.md)

**Functions:**
- `mapGeminiError(error)` - Map error to GeminiError
- `isGeminiErrorRetryable(error)` - Check if error is retryable
- `categorizeGeminiError(error)` - Categorize error type
- `createGeminiError(error)` - Create GeminiError instance

### Model Validation

**Refer to**: [`MODEL_VALIDATION_UTILS.md`](./MODEL_VALIDATION_UTILS.md)

**Functions:**
- `isValidModel(model)` - Check if model ID is valid
- `validateModel(model)` - Validate or throw error
- `getSafeModel(model, defaultType)` - Get safe model with fallback
- `getModelCategory(model)` - Get model category
- `getAllValidModels()` - Get all valid model IDs

### Performance Tools

**Refer to**: [`PERFORMANCE_UTILS.md`](./PERFORMANCE_UTILS.md)

**Functions:**
- `measureAsync(operation, metadata?)` - Measure async operation
- `measureSync(operation, metadata?)` - Measure sync operation
- `debounce(func, wait)` - Create debounced function
- `throttle(func, limit)` - Create throttled function

**Classes:**
- `PerformanceTimer` - Timer for operations
- `performanceTracker` - Global performance tracker

### Data Transformation

**Refer to**: [`DATA_TRANSFORMER_UTILS.md`](./DATA_TRANSFORMER_UTILS.md)

**Functions:**
- `extractBase64Data(base64)` - Extract base64 from data URL
- `extractTextFromResponse(response)` - Extract text from Gemini response

### Image Preparation

**Refer to**: [`IMAGE_PREPARER_UTILS.md`](./IMAGE_PREPARER_UTILS.md)

**Functions:**
- `prepareImageFromUri(uri)` - Prepare image from URI
- `prepareImage(base64, mimeType)` - Prepare image from base64
- `isValidBase64(base64)` - Validate base64 format

### Input Builders

**Refer to**: [`INPUT_BUILDERS.md`](./INPUT_BUILDERS.md)

**Single Image Features:**
- `buildUpscaleInput(base64, options?)` - Build upscale input
- `buildPhotoRestoreInput(base64, options?)` - Build photo restore input
- `buildRemoveBackgroundInput(base64, options?)` - Build remove background input
- `buildReplaceBackgroundInput(base64, options)` - Build replace background input

**Dual Image Features:**
- `buildFaceSwapInput(sourceBase64, targetBase64, options?)` - Build face swap input

**Video Features:**
- `buildAIHugInput(base64, options?)` - Build AI hug input
- `buildAIKissInput(base64, options?)` - Build AI kiss input
- `buildVideoFromDualImagesInput(base64a, base64b, options?)` - Build dual image video input

## 🔗 Related Modules

- **Infrastructure README**: [`../infrastructure/README.md`](../infrastructure/README.md)
- **Services**: [`../services/README.md`](../services/README.md)
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

### Error Handling Pattern
1. Catch API error
2. Map to GeminiError
3. Check if retryable
4. Retry or fail appropriately
5. Log error for debugging

### Model Validation Pattern
1. Get user input for model
2. Validate with isValidModel()
3. Get safe model with fallback
4. Check model category
5. Use validated model

### Performance Measurement Pattern
1. Wrap operation with measureAsync()
2. Record duration to performanceTracker
3. Analyze metrics periodically
4. Identify optimization opportunities
5. Iterate on improvements

### Image Processing Pattern
1. Validate image source
2. Prepare image with utilities
3. Build input for feature
4. Send to image service
5. Handle result/errors

## 🚨 Common Pitfalls

### Don't
- Skip model validation
- Ignore error types
- Measure too frequently (performance impact)
- Mutate input data
- Assume all models support all features

### Do
- Always validate model IDs
- Handle all error categories
- Use debounce/throttle for frequent operations
- Keep transformations pure
- Check model capabilities

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
