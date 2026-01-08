# Veo Polling Service

Tracks video generation operations using polling mechanism. Regularly checks operation status until completion.

## 📍 Import Path

```
import { veoPollingService } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use this service to automatically poll video generation operations until completion. Provides progress updates and handles polling logic.

**When to use:**
- Wait for video generation to complete
- Track generation progress
- Provide progress feedback to users
- Handle long-running operations
- Implement video generation UI

## 📌 Strategy

Video generation takes time and requires polling. This service:
- Implements automatic polling with backoff
- Provides progress callbacks for UI updates
- Handles operation completion and errors
- Manages polling intervals and timeouts
- Simplifies video generation workflow

**Key Decision**: Use this service instead of manual polling. It handles backoff, timeouts, and progress tracking automatically.

## ⚠️ Rules

### Usage Rules
- **MUST** provide valid operation name
- **MUST** provide API key and model ID
- **SHOULD** implement progress callback
- **MUST** handle polling completion appropriately
- **SHOULD NOT** implement custom polling logic

### Polling Rules
- **MUST** wait between polls (automatic backoff)
- **SHOULD** provide progress updates to users
- **MUST** handle operation errors
- **SHOULD** implement timeout for long operations
- **MUST NOT** poll too frequently

### Error Handling Rules
- **MUST** check operation error field
- **SHOULD** handle polling errors
- **MUST** throw errors on operation failure
- **SHOULD** provide user-friendly error messages
- **MUST NOT** ignore timeout errors

## 🤖 AI Agent Guidelines

### When Modifying This Service
1. **READ** the implementation file first
2. **UNDERSTAND** polling mechanism
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new functionality
5. **UPDATE** type definitions

### When Adding New Features
1. **CHECK** if similar feature exists
2. **FOLLOW** existing polling patterns
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
- **LOG** polling operations in development
- **COMMENT** complex logic only

## 📦 Available Methods

### `pollOperation(operationName, apiKey, model, onProgress?)`

Poll operation until completion with progress updates.

**Refer to**: [`veo-polling.service.ts`](./veo-polling.service.ts)

## 🔗 Related Modules

- **Veo HTTP Client**: [`VEO_HTTP_CLIENT_SERVICE.md`](./VEO_HTTP_CLIENT_SERVICE.md)
- **Video Generation**: [`VIDEO_GENERATION_SERVICE.md`](./VIDEO_GENERATION_SERVICE.md)
- **Error Handler**: [`VIDEO_ERROR_HANDLER_SERVICE.md`](./VIDEO_ERROR_HANDLER_SERVICE.md)

## 📋 Configuration Reference

### Polling Strategy

**Polling Intervals:**
- Initial: Every 2 seconds
- Backoff: Gradually increases based on progress
- Maximum: 5 minutes total wait time

**Polling Flow:**
1. Start → Check status
2. If not complete → Wait 2s → Check again
3. If progress update → Call onProgress callback
4. If complete or error → Return result
5. If timeout → Throw error

### Progress Callback

Callback receives `VideoGenerationProgress` with:
- `status`: Operation status (queued, processing, completed, failed)
- `progress`: Percentage (0-100)
- `message`: Optional status message

## 🎓 Usage Patterns

### Basic Polling
1. Import service
2. Call `pollOperation()` with operation name from HTTP client
3. Wait for completion promise to resolve
4. Extract video URL from result
5. Handle errors appropriately

### With Progress Updates
1. Import service
2. Implement `onProgress` callback
3. Update UI with progress percentage
4. Display status message to user
5. Handle completion

### With Timeout
1. Calculate timeout duration
2. Implement timeout check in progress callback
3. Throw error if timeout exceeded
4. Handle timeout error appropriately
5. Provide user feedback

### React Native Integration
1. Create state for progress and video URL
2. Start polling on user action
3. Update state in progress callback
4. Display progress to user
5. Show video when complete

## 🚨 Common Pitfalls

### Don't
- Implement manual polling (use this service)
- Ignore progress updates (bad UX)
- Forget to handle errors
- Poll without backoff (rate limits)
- Block UI during polling

### Do
- Always use progress callbacks
- Update UI with progress
- Handle all error states
- Implement cancellation support
- Provide user feedback
- Use reasonable timeouts

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../AI_GUIDELINES.md)
