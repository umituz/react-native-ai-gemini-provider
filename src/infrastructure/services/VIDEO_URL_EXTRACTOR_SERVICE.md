# Video URL Extractor Service

Utility for extracting video URLs from Veo API operation responses. Handles multiple response formats from different Veo API versions.

## 📍 Import Path

```
import { extractVideoUrl } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use video URL extractor to get video URLs from Veo operation responses. Handles multiple API response formats transparently.

**When to use:**
- Extract video URLs from Veo responses
- Handle different API versions
- Parse operation results
- Get download URLs
- Process video generation responses

## 📌 Strategy

Veo API has multiple response formats. This utility:
- Handles all response format variations
- Extracts URLs transparently
- Provides null safety
- Supports API version changes
- Simplifies response parsing

**Key Decision**: Always use extractor for Veo responses. Handles format variations automatically.

## ⚠️ Rules

### Extraction Rules
- **MUST** handle all response formats
- **SHOULD** validate operation object
- **MUST** return null if URL not found
- **SHOULD** log unexpected formats
- **MUST NOT** throw on missing URL

### Validation Rules
- **SHOULD** check operation structure
- **MUST** validate URL format
- **SHOULD** handle null responses
- **MUST** verify URL accessibility
- **SHOULD NOT** assume format

### Error Handling Rules
- **MUST** return null on failure
- **SHOULD** log parsing errors
- **MUST NOT** throw exceptions
- **SHOULD** handle malformed responses
- **MUST** provide graceful degradation

### URL Handling Rules
- **MUST** validate URL strings
- **SHOULD** check URL scheme
- **MUST** handle authentication requirements
- **SHOULD NOT** expose sensitive data
- **MUST** preserve URL parameters

## 🤖 AI Agent Guidelines

### When Extracting URLs
1. **PROVIDE** operation object
2. **CALL** extractVideoUrl()
3. **CHECK** return value
4. **HANDLE** null result
5. **USE** URL or report error

### When Handling Missing URLs
1. **CHECK** if result is null
2. **LOG** response structure
3. **VERIFY** operation completed
4. **REPORT** error to user
5. **PROVIDE** recovery options

### When Validating Responses
1. **CHECK** operation object structure
2. **LOOK** for expected fields
3. **HANDLE** format variations
4. **LOG** unexpected formats
5. **UPDATE** for new API versions

### Code Style Rules
- **VALIDATE** input structure
- **HANDLE** all format variations
- **RETURN** null for missing URLs
- **LOG** unexpected structures
- **TEST** with various formats

## 📦 Available Function

### extractVideoUrl

**Refer to**: [`gemini-video-url-extractor.ts`](./gemini-video-url-extractor.ts)

**Parameters:**
- `operation`: VeoOperation - Veo operation response object

**Returns:** string | null - Video URL if found, otherwise null

## 🔗 Related Modules

- **Video Generation**: [`VIDEO_GENERATION_SERVICE.md`](./VIDEO_GENERATION_SERVICE.md)
- **Video Downloader**: [`VIDEO_DOWNLOADER_SERVICE.md`](./VIDEO_DOWNLOADER_SERVICE.md)
- **Veo Polling**: [`VEO_POLLING_SERVICE.md`](./VEO_POLLING_SERVICE.md)

## 📋 Supported Response Formats

### Format 1: New SDK Format
```typescript
{
  response: {
    generatedVideos: [{
      video: { uri: "https://..." }
    }]
  }
}
```

### Format 2: Alternative SDK Format
```typescript
{
  response: {
    generatedVideos: [{
      uri: "https://..."
    }]
  }
}
```

### Format 3: Legacy Format
```typescript
{
  done: true,
  response: {
    videoUri: "https://..."
  }
}
```

## 🎓 Usage Patterns

### URL Extraction
1. Get operation response
2. Call extractVideoUrl()
3. Check if URL exists
4. Use URL for download
5. Handle missing URL

### Format Handling
1. Provide operation object
2. Extract URL transparently
3. Handle any format variation
4. Get URL or null
5. Process result accordingly

### Error Handling
1. Call extractor
2. Check for null result
3. Log response structure if missing
4. Report error to user
5. Provide recovery options

## 🚨 Common Pitfalls

### Don't
- Assume specific response format
- Throw on missing URL
- Skip null checking
- Hardcode response paths
- Ignore format variations

### Do
- Always check for null
- Handle all formats
- Log unexpected structures
- Return null gracefully
- Test with various responses

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
