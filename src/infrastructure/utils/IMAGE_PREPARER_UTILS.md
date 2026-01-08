# Image Preparer Utility

Helper functions for preparing images for Gemini API. Handles URI to base64 conversion and MIME type detection.

## 📍 Import Path

```
import {
  prepareImageFromUri,
  prepareImage,
  isValidBase64
} from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use image preparer to convert image URIs to base64 format. Handles various URI types and MIME type detection.

**When to use:**
- Convert image URIs to base64
- Detect MIME types from URIs
- Prepare images for API upload
- Validate base64 data
- Handle React Native image selection

## 📌 Strategy

Image preparation ensures compatibility. This utility:
- Converts various URI formats to base64
- Detects MIME types automatically
- Validates base64 data
- Handles different image sources
- Simplifies image processing

**Key Decision**: Always use preparer for image data. Handles URI conversion and MIME detection automatically.

## ⚠️ Rules

### Conversion Rules
- **MUST** validate URI before conversion
- **SHOULD** handle various URI formats
- **MUST** detect MIME type correctly
- **SHOULD** validate output base64
- **MUST NOT** lose data integrity

### Validation Rules
- **SHOULD** validate base64 format
- **MUST** check for empty data
- **SHOULD** validate MIME types
- **MUST** handle validation errors
- **SHOULD NOT** accept invalid data

### URI Handling Rules
- **MUST** support various URI types
- **SHOULD** detect format automatically
- **MUST** handle network URIs
- **SHOULD** cache conversions when possible
- **MUST NOT** fail silently

### Performance Rules
- **SHOULD** cache prepared images
- **MUST** handle large images efficiently
- **SHOULD** optimize when needed
- **MUST NOT** block main thread
- **SHOULD** handle concurrent requests

## 🤖 AI Agent Guidelines

### When Preparing Images
1. **CALL** prepareImageFromUri()
2. **PROVIDE** image URI
3. **WAIT** for conversion
4. **VALIDATE** output
5. **HANDLE** errors gracefully

### When Validating Base64
1. **CALL** isValidBase64()
2. **PROVIDE** base64 string
3. **CHECK** return value
4. **HANDLE** invalid data
5. **PROVIDE** clear feedback

### When Processing Multiple Images
1. **PREPARE** images in parallel
2. **USE** Promise.all()
3. **VALIDATE** all results
4. **CACHE** prepared images
5. **HANDLE** partial failures

### Code Style Rules
- **VALIDATE** input URIs
- **HANDLE** conversion errors
- **CACHE** when appropriate
- **VALIDATE** output data
- **LOG** preparation issues

## 📦 Available Functions

**Refer to**: [`image-preparer.util.ts`](./image-preparer.util.ts)

### Image Preparation
- `prepareImageFromUri(uri)` - Convert URI to base64
- `prepareImage(uri)` - Alias for prepareImageFromUri

### Validation
- `isValidBase64(str)` - Validate base64 format

## 🔗 Related Modules

- **Data Transformer**: [`./DATA_TRANSFORMER_UTILS.md`](./DATA_TRANSFORMER_UTILS.md)
- **Input Builders**: [`./INPUT_BUILDERS.md`](./INPUT_BUILDERS.md)
- **Image Edit Service**: [`../services/IMAGE_EDIT_SERVICE.md`](../services/IMAGE_EDIT_SERVICE.md)

## 📋 Supported Formats

### URI Types
- Data URL: `data:image/png;base64,...`
- HTTP/HTTPS URL: `https://example.com/image.jpg`
- File URI: `file:///path/to/image.png`
- React Native Asset: Asset paths

### MIME Types
- JPEG: `.jpg`, `.jpeg` → `image/jpeg`
- PNG: `.png` → `image/png`
- GIF: `.gif` → `image/gif`
- WebP: `.webp` → `image/webp`

### Return Type
```typescript
{
  base64: string;    // Pure base64 (no data URL)
  mimeType: string;  // Detected MIME type
}
```

## 🎓 Usage Patterns

### Basic Preparation
1. Provide image URI
2. Call prepareImageFromUri()
3. Get base64 and MIME type
4. Use in API request
5. Handle errors

### Image Picker Integration
1. Get URI from image picker
2. Call prepareImageFromUri()
3. Validate prepared image
4. Use in service call
5. Display to user

### Multiple Images
1. Collect all image URIs
2. Prepare in parallel
3. Validate all results
4. Use in batch operations
5. Handle partial failures

### Base64 Validation
1. Get base64 string
2. Call isValidBase64()
3. Check validation result
4. Use or reject data
5. Provide feedback

## 🚨 Common Pitfalls

### Don't
- Skip validation of prepared images
- Assume URI format
- Forget to handle errors
- Use unvalidated base64
- Block main thread with large images

### Do
- Always validate output
- Handle various URI formats
- Cache prepared images
- Handle errors gracefully
- Optimize for performance

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
