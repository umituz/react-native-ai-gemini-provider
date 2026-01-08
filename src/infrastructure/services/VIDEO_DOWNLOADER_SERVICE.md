# Video Downloader Service

Utility for downloading videos from authenticated Veo URLs and converting them to base64 data URIs. Veo URLs require authentication via the `x-goog-api-key` header.

## 📍 Import Path

```
import { downloadVideoFromVeo } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use video downloader to fetch generated videos from authenticated Veo URLs. Downloads and converts videos to base64 for local use.

**When to use:**
- Download generated videos from Veo API
- Convert videos to base64 format
- Handle authenticated video URLs
- Prepare videos for local storage
- Display videos in React Native apps

## 📌 Strategy

Veo URLs require authentication. This service:
- Adds authentication headers to requests
- Downloads video data
- Converts to base64 format
- Provides file metadata
- Handles download errors

**Key Decision**: Always use downloader for Veo video URLs. Direct requests will fail without authentication.

## ⚠️ Rules

### Download Rules
- **MUST** provide valid API key
- **SHOULD** validate video URL format
- **MUST** handle download errors
- **SHOULD** check file size limits
- **MUST NOT** expose API key in errors

### Authentication Rules
- **MUST** include API key in headers
- **SHOULD** use secure storage for keys
- **MUST NOT** cache video URLs indefinitely
- **SHOULD** refresh expired URLs
- **MUST** handle authentication failures

### File Handling Rules
- **SHOULD** validate video format
- **MUST** handle large files
- **SHOULD** compress if needed
- **MUST** check available storage
- **SHOULD NOT** block main thread

### Error Handling Rules
- **MUST** handle network errors
- **SHOULD** retry on transient failures
- **MUST** provide clear error messages
- **SHOULD** log download failures
- **MUST NOT** lose download progress

## 🤖 AI Agent Guidelines

### When Downloading Videos
1. **VALIDATE** video URL
2. **PROVIDE** API key
3. **CALL** downloadVideoFromVeo()
4. **HANDLE** download result
5. **STORE** or display video

### When Handling Large Videos
1. **CHECK** file size before download
2. **WARN** user about large downloads
3. **IMPLEMENT** progress tracking
4. **HANDLE** storage constraints
5. **PROVIDE** cancellation option

### When Handling Errors
1. **CATCH** download errors
2. **CHECK** error type
3. **RETRY** if appropriate
4. **INFORM** user of failure
5. **LOG** error details

### Code Style Rules
- **VALIDATE** inputs before download
- **HANDLE** all error cases
- **PROVIDE** progress feedback
- **CLEAN UP** on failure
- **SECURE** API keys

## 📦 Available Function

### downloadVideoFromVeo

**Refer to**: [`gemini-video-downloader.ts`](./gemini-video-downloader.ts)

**Parameters:**
- `videoUrl`: string - Authenticated Veo video URL
- `apiKey`: string - Google Cloud API key

**Returns:** Promise<VideoDownloadResult>
- `base64DataUri`: string - Base64 video with data URI prefix
- `sizeInMB`: number - File size in megabytes
- `mimeType`: string - Video MIME type

## 🔗 Related Modules

- **Video Generation**: [`VIDEO_GENERATION_SERVICE.md`](./VIDEO_GENERATION_SERVICE.md)
- **Veo HTTP Client**: [`VEO_HTTP_CLIENT_SERVICE.md`](./VEO_HTTP_CLIENT_SERVICE.md)
- **Video URL Extractor**: [`VIDEO_URL_EXTRACTOR_SERVICE.md`](./VIDEO_URL_EXTRACTOR_SERVICE.md)

## 📋 Return Type

```typescript
interface VideoDownloadResult {
  base64DataUri: string;  // data:video/mp4;base64,...
  sizeInMB: number;       // File size in MB
  mimeType: string;       // video/mp4 or video/webm
}
```

## 🎓 Usage Patterns

### Basic Download
1. Get video URL from generation response
2. Call downloadVideoFromVeo()
3. Get base64 result
4. Store or display video
5. Handle errors

### Large File Handling
1. Check file size before download
2. Warn user if large
3. Implement progress tracking
4. Download with cancellation option
5. Handle storage constraints

### Error Recovery
1. Catch download errors
2. Check if retryable
3. Retry with backoff
4. Inform user of failure
5. Provide alternative options

## 🚨 Common Pitfalls

### Don't
- Use direct fetch for Veo URLs
- Expose API key in errors
- Ignore file size limits
- Block main thread
- Skip error handling

### Do
- Always use downloader service
- Secure API keys properly
- Check file sizes
- Handle errors gracefully
- Provide user feedback

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
