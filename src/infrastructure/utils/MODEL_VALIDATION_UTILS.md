# Model Validation Utilities

Helper functions for validating model IDs and determining model categories. Ensures only valid models are used in requests.

## 📍 Import Path

```
import {
  isValidModel,
  validateModel,
  getSafeModel,
  getModelCategory,
  getAllValidModels,
  isTextModel,
  isImageModel,
  isImageEditModel,
  isVideoGenerationModel
} from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use validation utilities to verify model IDs before making API requests. Prevents errors from invalid model usage.

**When to use:**
- Validate model IDs before use
- Check model capabilities
- Get safe fallback models
- Determine model category
- List available models

## 📌 Strategy

Validation prevents API errors. This system:
- Validates models against whitelist
- Provides safe fallbacks
- Categorizes models by capability
- Lists all valid models
- Ensures model compatibility

**Key Decision**: Always validate user-provided model IDs. Use `getSafeModel()` for fallback handling.

## ⚠️ Rules

### Validation Rules
- **MUST** validate models before API calls
- **SHOULD** use `getSafeModel()` for user input
- **MUST** handle invalid models
- **SHOULD** validate early in request flow
- **MUST NOT** skip validation

### Fallback Rules
- **SHOULD** provide safe defaults
- **MUST** handle undefined models
- **SHOULD** use appropriate default types
- **MUST** document fallback behavior
- **SHOULD NOT** silently use wrong model

### Category Rules
- **MUST** check category before using model
- **SHOULD** verify model capabilities
- **MUST** handle unknown models
- **SHOULD** use category checks
- **MUST NOT** assume model type

### Usage Rules
- **SHOULD** validate in UI layer
- **MUST** throw on invalid models (validateModel)
- **SHOULD** return safe default (getSafeModel)
- **MUST** document validation behavior
- **SHOULD NOT** allow invalid models

## 🤖 AI Agent Guidelines

### When Validating Models
1. **CALL** validation function
2. **CHECK** return value
3. **HANDLE** invalid model case
4. **USE** fallback or throw
5. **LOG** validation failures

### When Getting Safe Models
1. **USE** getSafeModel() for user input
2. **PROVIDE** appropriate default type
3. **HANDLE** undefined input
4. **RETURN** valid model ID
5. **DOCUMENT** fallback behavior

### When Checking Categories
1. **CALL** category check function
2. **VERIFY** model supports feature
3. **USE** appropriate service
4. **HANDLE** category mismatch
5. **PROVIDE** clear error messages

### Code Style Rules
- **VALIDATE** early in request flow
- **USE** type-safe functions
- **HANDLE** all validation cases
- **PROVIDE** helpful error messages
- **DOCUMENT** validation behavior

## 📦 Available Functions

**Refer to**: [`model-validation.util.ts`](./model-validation.util.ts)

### Validation Functions
- `isValidModel(model)` - Check if model ID is valid
- `validateModel(model)` - Validate or throw error
- `getSafeModel(model, defaultType)` - Get safe model with fallback
- `getAllValidModels()` - Get all valid model IDs

### Category Checks
- `isTextModel(model)` - Check if text model
- `isImageModel(model)` - Check if image model
- `isImageEditModel(model)` - Check if image edit model
- `isVideoGenerationModel(model)` - Check if video model
- `getModelCategory(model)` - Get model category

## 🔗 Related Modules

- **Domain Entities**: [`../../domain/entities/README.md`](../../domain/entities/README.md)
- **Error Utilities**: [`./ERROR_UTILITIES.md`](./ERROR_UTILITIES.md)
- **Services README**: [`../services/README.md`](../services/README.md)

## 📋 Model Categories

### Text Models
Text generation models: `gemini-2.5-flash-lite`, `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-2.0-flash-exp`, `gemini-1.5-pro`, `gemini-1.5-flash`

### Text-to-Image Models
Image generation models: `imagen-4.0-generate-001`, `imagen-3.0-generate-001`

### Image Edit Models
Image editing models: `gemini-2.5-flash-image`, `gemini-3-pro-image-preview`

### Video Generation Models
Video generation models: `veo-3.1-fast-generate-preview`, `veo-3.0-generate-001`

## 🎓 Usage Patterns

### Model Validation
1. Call `isValidModel()` or `validateModel()`
2. Check return value
3. Handle invalid model case
4. Use validated model in request
5. Provide fallback if needed

### Safe Model Selection
1. Get user input for model
2. Call `getSafeModel()` with default
3. Use returned model ID
4. Handle validation errors
5. Use appropriate service

### Category-Based Routing
1. Get model category
2. Route to appropriate service
3. Use category-specific features
4. Handle unknown categories
5. Provide clear error messages

### Model Listing
1. Call `getAllValidModels()`
2. Filter by category if needed
3. Display to user
4. Handle model selection
5. Validate selection

## 🚨 Common Pitfalls

### Don't
- Skip model validation
- Use user input without validation
- Assume model type from name
- Allow invalid models to API
- Ignore category checks

### Do
- Always validate model IDs
- Use safe fallbacks
- Check model categories
- Validate early in flow
- Handle all validation cases

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
