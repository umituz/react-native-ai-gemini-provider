# Feature Model Selector Service

Selects appropriate Gemini models based on feature type. Supports runtime model overrides for flexibility.

## 📍 Import Path

```
import { featureModelSelector } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use this service to select the correct AI model for specific features. Provides default model mappings and supports runtime overrides.

**When to use:**
- Select models for image/video features
- Override models for testing or optimization
- A/B test different models
- Implement feature-based model selection
- Configure models based on user preferences

## 📌 Strategy

Different AI features require specialized models. This service:
- Maps features to appropriate default models
- Supports runtime model overrides
- Provides type-safe model selection
- Maintains feature-to-model relationships
- Enables flexible model configuration

**Key Decision**: Use feature-based model selection instead of hardcoding model IDs. This allows easy model updates and testing without code changes.

## ⚠️ Rules

### Usage Rules
- **MUST** use valid feature types (ImageFeatureType | VideoFeatureType)
- **SHOULD** check for existing overrides before setting new ones
- **MUST** clear overrides after temporary usage
- **SHOULD** use type-safe feature names
- **MUST NOT** use string literals for feature names

### Override Rules
- **SHOULD** use overrides sparingly
- **MUST** clean up overrides when done
- **SHOULD** check if override already exists
- **MUST NOT** set permanent overrides app-wide
- **SHOULD** restore original state after temporary overrides

### Configuration Rules
- **MUST** use valid model IDs
- **SHOULD** validate model IDs before use
- **MUST** handle model errors appropriately
- **SHOULD** log override operations in development
- **MUST NOT** override with invalid model IDs

## 🤖 AI Agent Guidelines

### When Modifying This Service
1. **READ** the implementation file first
2. **UNDERSTAND** feature-to-model mapping
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new functionality
5. **UPDATE** type definitions

### When Adding New Features
1. **CHECK** if feature type already exists
2. **FOLLOW** existing patterns
3. **UPDATE** feature constants
4. **DOCUMENT** in type definitions
5. **ADD** examples to tests (not docs)

### When Fixing Bugs
1. **REPRODUCE** bug locally first
2. **IDENTIFY** root cause
3. **FIX** with minimal changes
4. **ADD** regression test
5. **VERIFY** all tests pass

### Code Style Rules
- **USE** type-safe feature names
- **VALIDATE** model IDs
- **LOG** override operations in development
- **THROW** typed errors for invalid inputs
- **COMMENT** complex logic only

## 📦 Available Methods

### `setModelOverride(feature, model)`

Set a custom model override for a specific feature.

**Refer to**: [`feature-model-selector.ts`](./feature-model-selector.ts)

### `clearOverrides()`

Clear all model overrides and revert to default models.

**Refer to**: [`feature-model-selector.ts`](./feature-model-selector.ts)

### `getImageFeatureModel(feature)`

Get the model ID for an image feature.

**Refer to**: [`feature-model-selector.ts`](./feature-model-selector.ts)

### `getVideoFeatureModel(feature)`

Get the model ID for a video feature.

**Refer to**: [`feature-model-selector.ts`](./feature-model-selector.ts)

### `hasOverride(feature)`

Check if a feature has a custom override set.

**Refer to**: [`feature-model-selector.ts`](./feature-model-selector.ts)

## 🔗 Related Modules

- **Feature Constants**: [`domain/constants/feature-models.constants.ts`](../domain/constants/feature-models.constants.ts)
- **Image Generation**: [`IMAGE_GENERATION_SERVICE.md`](./IMAGE_GENERATION_SERVICE.md)
- **Video Generation**: [`VIDEO_GENERATION_SERVICE.md`](./VIDEO_GENERATION_SERVICE.md)

## 📋 Configuration Reference

### Supported Image Features

- `image-generation` - Text-to-image generation
- `image-edit` - Image editing and transformation
- `upscale` - Image upscaling
- `face-swap` - Face replacement
- `remove-background` - Background removal
- `inpainting` - Image inpainting
- `outpainting` - Image outpainting

### Supported Video Features

- `video-generation` - Text-to-video generation
- `video-preview` - Video preview generation

### Default Models

**Image Features:**
- `image-generation`: `imagen-3.0-generate-001`
- `image-edit`: `imagen-3.0-generate-001`
- `upscale`: `imagen-3.0-capabilities-001`
- Other features: `imagen-3.0-capabilities-001`

**Video Features:**
- `video-generation`: `veo-3.1-generate-001`
- `video-preview`: `veo-3.1-fast-generate-preview`

## 🎓 Usage Patterns

### Basic Model Selection
1. Import service
2. Call `getImageFeatureModel()` or `getVideoFeatureModel()` with feature type
3. Use returned model ID with generation service
4. Generate content with selected model

### Runtime Model Override
1. Call `setModelOverride()` with feature and custom model
2. Use feature services normally
3. All requests now use custom model
4. Clear override when done

### Temporary Override with Cleanup
1. Save current overrides state
2. Set temporary override
3. Execute operation with custom model
4. Restore original state in finally block

### Feature-Based Model Selection
1. Determine feature type from request
2. Call appropriate getter method (image vs video)
3. Receive model ID for feature
4. Execute generation with selected model

### A/B Testing Different Models
1. Define array of models to test
2. Loop through models
3. Set override for each model
4. Generate content and track results
5. Clear overrides after testing

## 🚨 Common Pitfalls

### Don't
- Set permanent overrides app-wide
- Forget to clear overrides after use
- Use string literals for feature names
- Override without checking existing state
- Use invalid model IDs

### Do
- Clean up overrides in finally blocks
- Check for existing overrides before setting
- Use type-safe feature names
- Validate model IDs before use
- Test with different models for optimization
- Log override operations in development

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../AI_GUIDELINES.md)
