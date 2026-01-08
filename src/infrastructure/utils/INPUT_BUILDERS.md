# Input Builders

Helper functions for building Gemini API inputs for image and video processing features. Creates properly formatted prompts and image arrays.

## 📍 Import Path

```
import {
  buildUpscaleInput,
  buildPhotoRestoreInput,
  buildRemoveBackgroundInput,
  buildReplaceBackgroundInput,
  buildFaceSwapInput,
  buildSingleImageInput,
  buildDualImageInput
} from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use input builders to create properly formatted inputs for image and video features. Simplifies prompt engineering and image data preparation.

**When to use:**
- Build inputs for image editing features
- Create prompts for video generation
- Format image data correctly
- Combine multiple images
- Simplify feature integration

## 📌 Strategy

Input builders encapsulate prompt complexity. This system:
- Creates optimized prompts for features
- Formats image data correctly
- Handles single and multiple images
- Provides consistent interface
- Simplifies feature usage

**Key Decision**: Always use input builders for image/video features. Ensures correct prompt engineering and data formatting.

## ⚠️ Rules

### Usage Rules
- **MUST** use builders for image/video features
- **SHOULD** provide valid base64 data
- **MUST** check required parameters
- **SHOULD** handle missing options
- **MUST NOT** create inputs manually

### Data Rules
- **MUST** provide valid base64 strings
- **SHOULD** validate image data
- **MUST** include correct MIME types
- **SHOULD** handle encoding errors
- **MUST NOT** pass invalid data

### Prompt Rules
- **MUST** use builder-generated prompts
- **SHOULD NOT** modify builder prompts
- **MUST** follow prompt patterns
- **SHOULD** test prompt effectiveness
- **MUST NOT** hardcode prompts

### Options Rules
- **SHOULD** provide appropriate options
- **MUST** check required parameters
- **SHOULD** use default values wisely
- **MUST** validate option values
- **SHOULD NOT** ignore option validation

## 🤖 AI Agent Guidelines

### When Building Inputs
1. **SELECT** appropriate builder function
2. **PROVIDE** valid base64 data
3. **CONFIGURE** options if needed
4. **USE** returned prompt and images
5. **HANDLE** builder errors

### When Using Image Features
1. **PREPARE** image base64 data
2. **CALL** appropriate builder
3. **USE** prompt from builder
4. **PASS** images array to service
5. **HANDLE** service response

### When Creating Custom Builders
1. **ANALYZE** existing builders
2. **FOLLOW** builder pattern
3. **CREATE** optimized prompt
4. **RETURN** consistent structure
5. **TEST** builder thoroughly

### Code Style Rules
- **USE** builders instead of manual input
- **VALIDATE** input data
- **HANDLE** missing options
- **FOLLOW** builder patterns
- **TEST** builder output

## 📦 Available Builders

### Single Image Builders

**Refer to**: [`image-feature-builders.util.ts`](./image-feature-builders.util.ts)

- `buildUpscaleInput(base64, options?)` - Image upscaling
- `buildPhotoRestoreInput(base64, options?)` - Photo restoration
- `buildAnimeSelfieInput(base64, options?)` - Anime style transformation
- `buildRemoveBackgroundInput(base64, options?)` - Background removal
- `buildRemoveObjectInput(base64, options?)` - Object removal
- `buildReplaceBackgroundInput(base64, options)` - Background replacement
- `buildHDTouchUpInput(base64, options?)` - HD enhancement

### Dual Image Builders

**Refer to**: [`image-feature-builders.util.ts`](./image-feature-builders.util.ts)

- `buildFaceSwapInput(sourceBase64, targetBase64, options?)` - Face swapping

### Video Builders

**Refer to**: [`video-feature-builders.util.ts`](./video-feature-builders.util.ts)

- `buildAIHugInput(base64, options?)` - AI hugging effect
- `buildAIKissInput(base64, options?)` - AI kissing effect
- `buildVideoFromDualImagesInput(base64a, base64b, options?)` - Dual image to video

### Base Builders

**Refer to**: [`base-input-builders.util.ts`](./base-input-builders.util.ts)

- `buildSingleImageInput(base64, prompt)` - Single image input
- `buildDualImageInput(base64a, base64b, prompt)` - Dual image input

## 🔗 Related Modules

- **Image Edit Service**: [`../services/IMAGE_EDIT_SERVICE.md`](../services/IMAGE_EDIT_SERVICE.md)
- **Image Preparer Utils**: [`../utils/IMAGE_PREPARER_UTILS.md`](../utils/IMAGE_PREPARER_UTILS.md)
- **Content Builder**: [`../content/README.md`](../content/README.md)

## 📋 Builder Return Type

All builders return:

```typescript
{
  prompt: string;
  images: Array<{
    base64: string;
    mimeType: string;
  }>;
}
```

This structure is compatible with `geminiImageEditService.editImage()`.

## 🎓 Usage Patterns

### Basic Feature Usage
1. Prepare image base64 data
2. Call appropriate builder function
3. Configure options if needed
4. Use returned prompt and images
5. Call image edit service

### Single Image Processing
1. Get image base64 string
2. Call single-image builder
3. Pass prompt and images to service
4. Handle service response
5. Display result

### Dual Image Processing
1. Get both image base64 strings
2. Call dual-image builder
3. Use returned input structure
4. Call appropriate service
5. Handle response

### Batch Processing
1. Prepare all images
2. Call builder for each image
3. Process inputs in sequence
4. Collect all results
5. Return batch results

### Custom Features
1. Analyze existing builders
2. Create custom builder function
3. Follow builder pattern
4. Return consistent structure
5. Test thoroughly

## 🚨 Common Pitfalls

### Don't
- Create inputs manually
- Modify builder prompts
- Skip builder functions
- Hardcode prompts
- Use invalid base64 data

### Do
- Always use input builders
- Follow builder patterns
- Validate input data
- Use builder-generated prompts
- Test builder output

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
