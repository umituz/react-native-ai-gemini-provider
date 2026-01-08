# Image Edit Service

Edits and transforms images using Gemini API. Supports background removal, object removal, face swap, and image enhancements.

## 📍 Import Path

```
import { geminiImageEditService } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use this service to edit and transform existing images with AI. Supports background removal, object deletion, style transfer, image enhancement, and various image manipulation operations.

**When to use:**
- Remove or replace image backgrounds
- Remove unwanted objects from images
- Enhance image quality (upscale, denoise, restore)
- Apply style transformations (anime, artistic styles)
- Face swapping and image compositing

## 📌 Strategy

Image editing requires both visual and textual understanding. This service:
- Uses multimodal models (gemini-2.5-flash-image)
- Accepts base64-encoded images as input
- Returns edited images with text descriptions
- Supports both single and multiple image inputs
- Handles image-specific response formats

**Key Decision**: Image editing uses TEXT + IMAGE response modalities. The service returns both edited image data and explanatory text when applicable.

## ⚠️ Rules

### Usage Rules
- **MUST** initialize provider with API key before use
- **MUST** provide base64-encoded images
- **SHOULD** use specific, clear prompts
- **MUST NOT** exceed image size limits
- **MUST** handle image editing errors appropriately

### Prompt Rules
- **SHOULD** clearly describe desired edit
- **MUST** specify what to keep vs remove
- **SHOULD** include fill instructions for removals
- **MUST NOT** request prohibited content

### Configuration Rules
- **MUST** use valid model IDs (gemini-2.5-flash-image)
- **SHOULD** optimize image size before sending
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
2. **UNDERSTAND** multimodal response format
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

### `editImage(prompt, images)`

Edit images with text instructions.

**Refer to**: [`gemini-image-edit.service.ts`](./gemini-image-edit.service.ts)

## 🔗 Related Modules

- **Domain Types**: [`domain/entities/README.md`](../domain/entities/README.md)
- **Image Generation**: [`IMAGE_GENERATION_SERVICE.md`](./IMAGE_GENERATION_SERVICE.md)
- **Core Client**: [`CORE_CLIENT_SERVICE.md`](./CORE_CLIENT_SERVICE.md)
- **Image Preparers**: [`IMAGE_PREPARER_UTILS.md`](../infrastructure/utils/IMAGE_PREPARER_UTILS.md)

## 📋 Configuration Reference

### Generation Config
See: [`domain/entities/README.md`](../domain/entities/README.md)

### Model Selection
- Current model: `gemini-2.5-flash-image`
- Response modalities: TEXT + IMAGE
- Output format: PNG (typically)

### Error Types
See: [`ERROR_UTILITIES.md`](../infrastructure/utils/ERROR_UTILITIES.md)

## 🎓 Usage Patterns

### Background Removal
1. Import service
2. Prepare base64-encoded image
3. Call `editImage()` with removal prompt
4. Handle response (contains `imageUrl`, `imageBase64`)
5. Display or save edited image

### Object Removal
1. Import service
2. Prepare base64-encoded image
3. Create prompt describing object to remove and fill instructions
4. Call `editImage()` with prompt and image
5. Handle result showing edited image

### Background Replacement
1. Import service
2. Prepare base64-encoded image
3. Create prompt describing new background
4. Specify to keep main subject
5. Call `editImage()` with detailed prompt
6. Handle response

### Image Enhancement
1. Import service
2. Prepare base64-encoded image
3. Create enhancement prompt (brightness, contrast, etc.)
4. Call `editImage()` with prompt and image
5. Handle enhanced result

## 🚨 Common Pitfalls

### Don't
- Use vague prompts ("remove this")
- Forget to specify fill instructions
- Send extremely large images
- Expect perfect results on complex edits
- Ignore safety filters

### Do
- Be specific about what to edit
- Describe how to fill removed areas
- Optimize image size before sending
- Handle multimodal responses (text + image)
- Implement retry logic
- Test with various image types

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../AI_GUIDELINES.md)
