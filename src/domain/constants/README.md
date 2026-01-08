# Domain Constants

Constant values and model catalogs for Gemini provider. Contains feature-based model mappings for image and video operations.

## 📍 Import Path

```
import {
  GEMINI_IMAGE_FEATURE_MODELS,
  GEMINI_VIDEO_FEATURE_MODELS,
  getGeminiImageFeatureModel,
  getGeminiVideoFeatureModel,
  getAllFeatureModels
} from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use constants to map features to appropriate models. Provides centralized model selection for image and video processing features.

**When to use:**
- Get model ID for specific feature
- Display available features in UI
- Validate feature requests
- Map user features to models
- List supported operations

## 📌 Strategy

Features map to specific models. This system:
- Provides constant feature-to-model mappings
- Centralizes model configuration
- Enables feature validation
- Simplifies model selection
- Maintains consistency across codebase

**Key Decision**: Use feature constants instead of hardcoded model IDs. This enables centralized model management and updates.

## ⚠️ Rules

### Usage Rules
- **MUST** use constants for model selection
- **SHOULD** validate feature before use
- **MUST** handle unknown features gracefully
- **SHOULD** check model compatibility
- **MUST NOT** hardcode model IDs

### Feature Selection Rules
- **MUST** select appropriate model for feature
- **SHOULD** use getter functions
- **MUST** validate feature type
- **SHOULD** handle missing features
- **MUST** return valid model IDs

### Validation Rules
- **SHOULD** validate feature strings
- **MUST** check feature exists
- **SHOULD** provide fallback models
- **MUST** throw on invalid features
- **SHOULD** log validation failures

### Maintenance Rules
- **MUST** update constants when models change
- **SHOULD** document model changes
- **MUST** maintain backward compatibility
- **SHOULD** test feature mappings
- **MUST** update documentation

## 🤖 AI Agent Guidelines

### When Getting Model for Feature
1. **CALL** getGeminiImageFeatureModel() or getGeminiVideoFeatureModel()
2. **VALIDATE** feature exists
3. **RETURN** model ID
4. **HANDLE** unknown features
5. **LOG** model selection

### When Listing Features
1. **CALL** getAllFeatureModels()
2. **FILTER** by feature type
3. **DISPLAY** to user
4. **GROUP** by category
5. **HANDLE** empty lists

### When Validating Features
1. **CHECK** feature in constants
2. **VERIFY** model exists
3. **RETURN** validation result
4. **PROVIDE** error messages
5. **SUGGEST** alternatives

### Code Style Rules
- **USE** constants instead of hardcoded values
- **IMPORT** specific constants needed
- **VALIDATE** feature inputs
- **HANDLE** edge cases
- **DOCUMENT** custom features

## 📦 Available Constants

### Image Feature Models

**Refer to**: [`feature-models.constants.ts`](./feature-models.constants.ts)

**Features:**
- `upscale` - Image upscaling
- `photo-restore` - Photo restoration
- `face-swap` - Face swapping
- `anime-selfie` - Anime style transformation
- `remove-background` - Background removal
- `remove-object` - Object removal
- `hd-touch-up` - HD enhancement
- `replace-background` - Background replacement

**Model**: All use `gemini-2.0-flash-exp`

### Video Feature Models

**Refer to**: [`feature-models.constants.ts`](./feature-models.constants.ts)

**Features:**
- `ai-hug` - AI hugging effect
- `ai-kiss` - AI kissing effect

**Model**: All use `gemini-2.0-flash-exp`

## 🔗 Related Modules

- **Domain Entities**: [`../entities/README.md`](../entities/README.md)
- **Domain README**: [`../README.md`](../README.md)
- **Model Selector**: [`../../infrastructure/services/FEATURE_MODEL_SELECTOR_SERVICE.md`](../../infrastructure/services/FEATURE_MODEL_SELECTOR_SERVICE.md)

## 📋 Feature Reference

### Image Editing Features
- **upscale**: Enlarge image while maintaining quality
- **photo-restore**: Restore old or damaged photos
- **face-swap**: Swap faces between images
- **anime-selfie**: Transform selfie to anime style
- **remove-background**: Remove image background
- **remove-object**: Remove specific objects from image
- **hd-touch-up**: Enhance image quality to HD
- **replace-background**: Replace image background

### Video Features
- **ai-hug**: Generate video of subjects hugging
- **ai-kiss**: Generate video of subjects kissing

## 🎓 Usage Patterns

### Feature-Based Model Selection
1. Determine feature type (image or video)
2. Call appropriate getter function
3. Get model ID for feature
4. Use model in service call
5. Handle unknown features

### Feature Listing
1. Call getAllFeatureModels()
2. Iterate through feature list
3. Group by category
4. Display to user
5. Handle feature selection

### Feature Validation
1. Check feature in constants
2. Verify model mapping exists
3. Validate feature type
4. Return validation result
5. Provide feedback

## 🚨 Common Pitfalls

### Don't
- Hardcode model IDs in application code
- Use features without validation
- Assume all features use same model
- Skip feature existence checks
- Use invalid feature strings

### Do
- Use constants for model selection
- Validate features before use
- Check model mappings
- Handle unknown features gracefully
- Update constants when models change

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../AI_GUIDELINES.md)
