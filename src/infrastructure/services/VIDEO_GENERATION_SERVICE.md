# Video Generation Service

Generates videos from text prompts and images using Google Veo API.

## 📍 Import Path

```
import { geminiVideoGenerationService } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use this service to generate AI-powered videos from text descriptions or images. Supports text-to-video and image-to-video generation with progress tracking using Veo models.

**When to use:**
- Generate videos from text descriptions
- Animate existing images
- Create video content for applications
- Product visualization and motion graphics

## 📌 Strategy

Video generation is an async, long-running operation that requires special handling. This service:
- Implements automatic polling for operation status
- Provides progress callbacks for UI feedback
- Supports multiple aspect ratios for different platforms
- Handles video download and URL generation
- Manages queuing and processing states

**Key Decision**: Video generation uses polling mechanism since processing takes time. The service automatically handles status checks and provides progress updates through callbacks.

## ⚠️ Rules

### Usage Rules
- **MUST** initialize provider with API key before use
- **MUST** handle async operation completion
- **SHOULD** implement progress callbacks for UX
- **MUST NOT** assume immediate results
- **MUST** handle video generation errors appropriately

### Prompt Rules
- **SHOULD** describe motion and action clearly
- **SHOULD** specify camera movements
- **MUST NOT** exceed 2000 character limit
- **SHOULD** include atmosphere and mood details

### Configuration Rules
- **MUST** use valid model IDs (veo-3.1-fast-generate-preview)
- **SHOULD** select appropriate aspect ratio for platform
- **MUST** respect content safety guidelines
- **SHOULD** set reasonable timeout expectations

### Error Handling Rules
- **MUST** catch and handle `GeminiError`
- **MUST** check `result.status` for completion
- **MUST** handle `result.error` for failures
- **SHOULD** provide user-friendly error messages
- **MUST NOT** expose API keys in errors

## 🤖 AI Agent Guidelines

### When Modifying This Service
1. **READ** the implementation file first
2. **UNDERSTAND** polling mechanism
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new functionality
5. **UPDATE** type definitions

### When Adding New Features
1. **CHECK** if similar feature exists in video services
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
- **USE** async/await (no callbacks except onProgress)
- **VALIDATE** inputs at function entry
- **THROW** typed errors (`GeminiError`)
- **LOG** important operations
- **COMMENT** complex logic only

## 📦 Available Methods

### `generateTextToVideo(input, onProgress?)`

Generate video from text prompt.

**Refer to**: [`gemini-video-generation.service.ts`](./gemini-video-generation.service.ts)

### `generateVideo(input, onProgress?)`

Generate video from text and/or image.

**Refer to**: [`gemini-video-generation.service.ts`](./gemini-video-generation.service.ts)

## 🔗 Related Modules

- **Domain Types**: [`domain/entities/README.md`](../domain/entities/README.md)
- **Veo HTTP Client**: [`VEO_HTTP_CLIENT_SERVICE.md`](./VEO_HTTP_CLIENT_SERVICE.md)
- **Veo Polling**: [`VEO_POLLING_SERVICE.md`](./VEO_POLLING_SERVICE.md)
- **Video Downloader**: [`VIDEO_DOWNLOADER_SERVICE.md`](./VIDEO_DOWNLOADER_SERVICE.md)
- **Video Error Handler**: [`VIDEO_ERROR_HANDLER_SERVICE.md`](./VIDEO_ERROR_HANDLER_SERVICE.md)

## 📋 Configuration Reference

### Generation Config
See: [`domain/entities/README.md`](../domain/entities/README.md)

### Model Selection
- Current model: `veo-3.1-fast-generate-preview`
- Aspect ratios: `16:9` | `9:16` | `1:1` | `4:3`
- Resolution: Up to 4K
- Duration: Auto-determined by model

### Error Types
See: [`ERROR_UTILITIES.md`](../infrastructure/utils/ERROR_UTILITIES.md)

## 🎓 Usage Patterns

### Basic Text-to-Video
1. Import service
2. Call `generateTextToVideo()` with prompt and options
3. Provide `onProgress` callback for UI updates
4. Handle response (contains `videoUrl`, `status`, `progress`)
5. Display video or handle errors

### Image-to-Video
1. Import service
2. Prepare base64-encoded image
3. Call `generateVideo()` with prompt and image
4. Monitor progress through callback
5. Download or display result video

### With Progress Tracking
1. Implement progress callback function
2. Update UI with progress percentage and status
3. Handle status changes: queued → processing → completed/failed
4. Show appropriate loading states
5. Display final video or error message

### With Negative Prompts
1. Prepare main prompt describing desired content
2. Add negative prompt for unwanted elements
3. Call generation method with both prompts
4. Handle result as normal

## 🚨 Common Pitfalls

### Don't
- Assume immediate video generation (takes minutes)
- Ignore progress callbacks (bad UX)
- Forget to handle failed status
- Use extremely long prompts (>2000 chars)
- Expect all videos to have same duration

### Do
- Implement progress tracking
- Handle all status states (queued, processing, completed, failed)
- Provide loading feedback to users
- Use descriptive prompts with motion details
- Specify camera movements and atmosphere
- Handle timeouts appropriately
- Consider aspect ratio for target platform

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../AI_GUIDELINES.md)
