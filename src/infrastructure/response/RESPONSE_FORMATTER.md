# Response Formatter

Utility for formatting Gemini API responses into consistent output structures. Handles text and image data extraction from API responses.

## 📍 Import Path

```
import { ResponseFormatter } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use ResponseFormatter to convert raw Gemini API responses into consistent, typed structures. Extracts text and image data automatically.

**When to use:**
- Format API responses consistently
- Extract text from responses
- Extract image data from multimodal responses
- Normalize response structures
- Handle response types safely

## 📌 Strategy

Response formatting ensures consistency. This utility:
- Extracts text content automatically
- Handles image data in responses
- Provides typed response structures
- Preserves original response
- Simplifies response handling

**Key Decision**: Always format responses before using. Provides consistent interface for different response types.

## ⚠️ Rules

### Formatting Rules
- **MUST** format all API responses
- **SHOULD** specify expected response type
- **MUST** check for optional fields
- **SHOULD** preserve original response
- **MUST NOT** assume response structure

### Type Safety Rules
- **SHOULD** use generic type parameter
- **MUST** check for optional fields
- **SHOULD** use type guards
- **MUST** handle undefined values
- **SHOULD NOT** use non-null assertion

### Data Extraction Rules
- **MUST** handle missing text gracefully
- **SHOULD** validate image data
- **MUST** check for image presence
- **SHOULD** extract MIME type correctly
- **MUST NOT** fail on partial data

### Error Handling Rules
- **SHOULD** wrap formatting in try-catch
- **MUST** handle malformed responses
- **SHOULD** log formatting errors
- **MUST** provide fallback values
- **SHOULD NOT** throw formatting errors

## 🤖 AI Agent Guidelines

### When Formatting Responses
1. **CREATE** ResponseFormatter instance
2. **CALL** formatResponse() with type
3. **CHECK** for optional fields
4. **EXTRACT** needed data
5. **HANDLE** missing data gracefully

### When Handling Text Responses
1. **FORMAT** response with text type
2. **CHECK** text field exists
3. **VALIDATE** text not empty
4. **USE** text value
5. **HANDLE** empty text case

### When Handling Image Responses
1. **FORMAT** response with image type
2. **CHECK** imageUrl exists
3. **EXTRACT** imageBase64 data
4. **USE** MIME type correctly
5. **HANDLE** missing image case

### Code Style Rules
- **USE** generic type parameter
- **CHECK** optional fields before use
- **PROVIDE** fallback values
- **LOG** formatting issues
- **PRESERVE** original response

## 📦 Available Class

### ResponseFormatter

**Refer to**: [`ResponseFormatter.ts`](./ResponseFormatter.ts)

**Methods:**
- `formatResponse<T>(response, input)` - Format response to typed structure

## 🔗 Related Modules

- **Text Generation Service**: [`../services/TEXT_GENERATION_SERVICE.md`](../services/TEXT_GENERATION_SERVICE.md)
- **Image Generation Service**: [`../services/IMAGE_GENERATION_SERVICE.md`](../services/IMAGE_GENERATION_SERVICE.md)
- **Generation Executor**: [`../services/GENERATION_EXECUTOR_SERVICE.md`](../services/GENERATION_EXECUTOR_SERVICE.md)

## 📋 Response Types

### Text Response
```typescript
{
  text: string;              // Extracted text content
  response: unknown;         // Original API response
}
```

### Multimodal Response
```typescript
{
  text: string;              // Extracted text content
  imageUrl: string;          // Data URL (data:image/png;base64,...)
  imageBase64: string;       // Base64 image data
  mimeType: string;          // Image MIME type
  response: unknown;         // Original API response
}
```

## 🎓 Usage Patterns

### Basic Formatting
1. Create ResponseFormatter instance
2. Call formatResponse() with type
3. Extract needed fields
4. Check for optional data
5. Handle response appropriately

### Text Response Handling
1. Format response as text type
2. Check text field exists
3. Validate text content
4. Use text in application
5. Handle empty text case

### Image Response Handling
1. Format response with image type
2. Check imageUrl exists
3. Extract imageBase64 if needed
4. Use imageUrl for display
5. Handle missing image case

### Multimodal Handling
1. Format response
2. Check for both text and image
3. Handle different response types
4. Display appropriate content
5. Fallback to available data

### Type-Safe Formatting
1. Define response interface
2. Format with generic type
3. Use type guards
4. Narrow response type
5. Use typed data safely

## 🚨 Common Pitfalls

### Don't
- Assume text field always exists
- Use imageUrl without checking
- Discard original response
- Use non-null assertions
- Skip type checking

### Do
- Always check optional fields
- Validate data before use
- Preserve original response
- Use type guards
- Handle missing data gracefully

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
