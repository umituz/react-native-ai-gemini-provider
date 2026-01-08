# Content Builder

Helper class for building content structures for Gemini API. Creates properly formatted content objects with text, images, and files.

## 📍 Import Path

```
import { ContentBuilder } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use ContentBuilder to create properly formatted Gemini content objects. Handles text, images, and file data for multimodal inputs.

**When to use:**
- Build content for text generation
- Create multimodal content (text + images)
- Format chat messages
- Add file data to requests
- Build conversation history

## 📌 Strategy

ContentBuilder ensures correct API format. This class:
- Creates properly structured content objects
- Handles different content types (text, images, files)
- Simplifies multimodal content creation
- Provides consistent formatting
- Validates content structure

**Key Decision**: Use ContentBuilder for all content creation. Ensures compatibility with Gemini API format.

## ⚠️ Rules

### Content Creation Rules
- **MUST** specify role (user or model)
- **SHOULD** use builder methods
- **MUST** provide valid parts array
- **SHOULD** validate content structure
- **MUST NOT** create malformed content

### Content Part Rules
- **MUST** use correct MIME types
- **SHOULD** provide valid base64 data
- **MUST** handle encoding properly
- **SHOULD** validate image data
- **MUST NOT** use invalid formats

### Multimodal Rules
- **SHOULD** include text with images
- **MUST** order parts appropriately
- **SHOULD** limit image count
- **MUST** handle mixed content types
- **SHOULD NOT** exceed size limits

### Best Practices Rules
- **SHOULD** use builder for consistency
- **MUST** validate content before sending
- **SHOULD** handle build errors
- **MUST** use appropriate MIME types
- **SHOULD** test content structures

## 🤖 AI Agent Guidelines

### When Building Text Content
1. **CREATE** ContentBuilder instance
2. **BUILD** text part
3. **CREATE** content with role
4. **VALIDATE** structure
5. **RETURN** content object

### When Building Multimodal Content
1. **CREATE** ContentBuilder instance
2. **BUILD** text part
3. **BUILD** image data parts
4. **COMBINE** parts in array
5. **CREATE** content object

### When Building Chat History
1. **CREATE** ContentBuilder instance
2. **BUILD** user messages
3. **BUILD** model responses
4. **COMBINE** in array
5. **RETURN** conversation array

### Code Style Rules
- **USE** builder methods
- **VALIDATE** inputs
- **HANDLE** errors gracefully
- **COMMENT** complex content
- **TEST** content structures

## 📦 Available Class

### ContentBuilder

**Refer to**: [`ContentBuilder.ts`](./ContentBuilder.ts)

**Methods:**
- `buildContent(role, parts)` - Build GeminiContent object
- `buildTextPart(text)` - Build text part
- `buildImageDataPart(mimeType, data)` - Build image data part
- `buildFileDataPart(mimeType, fileUri)` - Build file data part

## 🔗 Related Modules

- **Domain Entities**: [`../../domain/entities/README.md`](../../domain/entities/README.md)
- **Text Generation**: [`../services/TEXT_GENERATION_SERVICE.md`](../services/TEXT_GENERATION_SERVICE.md)
- **Infrastructure README**: [`../infrastructure/README.md`](../infrastructure/README.md)

## 📋 Supported MIME Types

### Image Formats
- `image/png` - PNG images
- `image/jpeg` - JPEG images
- `image/webp` - WebP images
- `image/heic` - HEIC images
- `image/heif` - HEIF images

### Document Formats
- `application/pdf` - PDF documents
- `text/plain` - Plain text
- `text/html` - HTML documents
- `application/json` - JSON data

## 🎓 Usage Patterns

### Basic Text Content
1. Create ContentBuilder instance
2. Build text part
3. Create content with role
4. Use in service call
5. Handle response

### Multimodal Content
1. Create ContentBuilder instance
2. Build text part
3. Build image data parts
4. Combine all parts
5. Create content with role

### Chat Conversation
1. Create ContentBuilder instance
2. Build user message content
3. Build model response content
4. Repeat for conversation
5. Return content array

### File-Based Content
1. Create ContentBuilder instance
2. Build text instruction
3. Build file data part
4. Create content with role
5. Process file

## 🚨 Common Pitfalls

### Don't
- Create content objects manually
- Skip role specification
- Use invalid MIME types
- Forget to validate content
- Mix up part order

### Do
- Use ContentBuilder for all content
- Always specify role
- Validate MIME types
- Test content structure
- Follow API format

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
