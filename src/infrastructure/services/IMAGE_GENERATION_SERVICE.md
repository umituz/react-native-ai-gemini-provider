# Image Generation Service

Generates images from text prompts using Google Imagen API.

## 📍 Import Path

```
import { geminiImageGenerationService } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use this service to generate AI-powered images from text descriptions. Supports creating photorealistic images, artistic renderings, and various visual styles using Imagen 4.0 model.

**When to use:**
- Generate images from text descriptions
- Create visual content for applications
- Generate artistic or photorealistic imagery
- Product visualization and concept art

## 📌 Strategy

Image generation requires specialized handling compared to text generation. This service:
- Uses Imagen 4.0 model specifically for images
- Returns base64-encoded image data
- Handles image-specific response formats
- Integrates with retry logic for reliability
- Validates prompt content for safety

**Key Decision**: Images are returned as base64 data URLs for React Native compatibility. Use `imageBase64` for raw data or `imageUrl` for React Native Image component.

## ⚠️ Rules

### Usage Rules
- **MUST** initialize provider with API key before use
- **MUST** handle image data appropriately (display or save)
- **MUST NOT** exceed API rate limits
- **SHOULD** provide detailed prompts for better results
- **MUST** handle image generation errors appropriately

### Prompt Rules
- **SHOULD** be descriptive and specific
- **SHOULD** include style and lighting information
- **MUST NOT** include prohibited content
- **SHOULD** follow prompt templates for consistency

### Configuration Rules
- **MUST** use valid model IDs
- **SHOULD** configure aspect ratio appropriately (currently 1:1 only)
- **MUST** respect content safety guidelines
- **SHOULD** implement retry logic for failures

### Error Handling Rules
- **MUST** catch and handle `GeminiError`
- **MUST** provide user-friendly error messages
- **SHOULD** log errors for debugging
- **MUST NOT** expose API keys in errors

## 🤖 AI Agent Guidelines

### When Modifying This Service
1. **READ** the implementation file first
2. **UNDERSTAND** image response format
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new functionality
5. **UPDATE** type definitions

### When Adding New Features
1. **CHECK** if similar feature exists in image services
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
- **LOG** important operations
- **COMMENT** complex logic only

## 📦 Available Methods

### `generateImage(prompt, images?, config?)`

Generate an image from text prompt.

**Refer to**: [`gemini-image-generation.service.ts`](./gemini-image-generation.service.ts)

## 🔗 Related Modules

- **Domain Types**: [`domain/entities/README.md`](../domain/entities/README.md)
- **Image Edit Service**: [`IMAGE_EDIT_SERVICE.md`](./IMAGE_EDIT_SERVICE.md)
- **Core Client**: [`CORE_CLIENT_SERVICE.md`](./CORE_CLIENT_SERVICE.md)
- **Retry Service**: [`RETRY_SERVICE.md`](./RETRY_SERVICE.md)

## 📋 Configuration Reference

### Generation Config
See: [`domain/entities/README.md`](../domain/entities/README.md)

### Model Selection
- Current model: `imagen-4.0-generate-001`
- Aspect ratio: 1:1 (only supported ratio)
- Format: `image/png`
- Encoding: Base64

### Error Types
See: [`ERROR_UTILITIES.md`](../infrastructure/utils/ERROR_UTILITIES.md)

## 🎓 Usage Patterns

### Basic Image Generation
1. Import service
2. Call `generateImage()` with descriptive prompt
3. Handle response (contains `imageUrl`, `imageBase64`, `mimeType`)
4. Display image in React Native Image component
5. Handle errors appropriately

### With Retry Logic
1. Wrap call in retry mechanism
2. Configure max retries and delays
3. Handle retryable errors (network, rate limits)
4. Provide feedback to user during retries

### Saving Generated Images
1. Generate image using service
2. Extract `imageBase64` from result
3. Save to filesystem using React Native FS
4. Handle file system errors

### Uploading Generated Images
1. Generate image using service
2. Extract base64 data
3. Convert to appropriate format
4. Upload to server/storage
5. Handle upload errors

## 🚨 Common Pitfalls

### Don't
- Use vague or generic prompts
- Ignore error handling
- Assume immediate results (generation takes time)
- Exceed rate limits
- Try to edit images with this service (use IMAGE_EDIT_SERVICE)

### Do
- Provide detailed, specific prompts
- Include style and lighting information
- Handle all error types
- Implement loading states
- Use image edit service for modifications
- Cache generated images appropriately

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../AI_GUIDELINES.md)
