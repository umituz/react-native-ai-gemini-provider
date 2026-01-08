# Veo HTTP Client Service

Makes HTTP requests to Google Veo API for video generation. Initiates video generation operations and queries status.

## 📍 Import Path

```
import { veoHttpClient } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use this service to communicate directly with Veo API for video generation operations. Handles HTTP requests for starting and polling video generation.

**When to use:**
- Start video generation operations
- Query operation status
- Access raw Veo API responses
- Implement custom polling logic
- Debug video generation issues

## 📌 Strategy

Veo API uses asynchronous operations with polling. This service:
- Sends HTTP requests to Veo API endpoints
- Initiates video generation operations
- Queries operation status
- Returns raw API responses
- Implements retry logic for network failures

**Key Decision**: Use `veo-polling.service.ts` for automatic polling instead of manually polling with this service. This service is for advanced use cases requiring custom polling logic.

## ⚠️ Rules

### Usage Rules
- **MUST** provide valid API key
- **MUST** use valid Veo model IDs
- **SHOULD** save operation names for polling
- **MUST** handle network errors appropriately
- **SHOULD NOT** poll manually (use polling service)

### Request Rules
- **MUST** provide prompt in instances array
- **SHOULD** set appropriate aspect ratio
- **MUST** use supported parameters
- **SHOULD** include negative prompt when needed
- **MUST NOT** exceed request size limits

### Error Handling Rules
- **MUST** catch and handle HTTP errors
- **SHOULD** check operation error field
- **MUST** validate operation responses
- **SHOULD** implement retry logic for failures
- **MUST NOT** expose API keys in errors

## 🤖 AI Agent Guidelines

### When Modifying This Service
1. **READ** the implementation file first
2. **UNDERSTAND** Veo API structure
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new functionality
5. **UPDATE** type definitions

### When Adding New Features
1. **CHECK** if feature exists in Veo API
2. **FOLLOW** existing request patterns
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
- **LOG** HTTP requests in development
- **COMMENT** complex logic only

## 📦 Available Methods

### `startOperation(model, apiKey, instances, parameters)`

Initiate video generation operation.

**Refer to**: [`veo-http-client.service.ts`](./veo-http-client.service.ts)

### `getOperation(operationName, apiKey, model)`

Query operation status.

**Refer to**: [`veo-http-client.service.ts`](./veo-http-client.service.ts)

## 🔗 Related Modules

- **Veo Polling**: [`VEO_POLLING_SERVICE.md`](./VEO_POLLING_SERVICE.md)
- **Video Generation**: [`VIDEO_GENERATION_SERVICE.md`](./VIDEO_GENERATION_SERVICE.md)
- **Video Downloader**: [`VIDEO_DOWNLOADER_SERVICE.md`](./VIDEO_DOWNLOADER_SERVICE.md)

## 📋 Configuration Reference

### VeoOperation

Operation response structure defined in: [`domain/entities/README.md`](../domain/entities/README.md)

**Fields:**
- `name`: string - Operation full path
- `done`: boolean - Completion status
- `response`: object - Video data (when complete)
- `metadata`: object - Progress information
- `error`: object - Error details (if failed)

### API Endpoints

**Start Operation:**
- Method: POST
- URL: `https://generativelanguage.googleapis.com/v1beta/models/{model}:predict`
- Body: `{ instances: [{ prompt: string }], parameters: { aspectRatio: string } }`

**Get Operation:**
- Method: GET
- URL: `https://generativelanguage.googleapis.com/v1beta/{operationName}`

### Model IDs

Supported Veo models: `veo-3.1-fast-generate-preview`, `veo-3.0-generate-001`

See: [`domain/constants/README.md`](../domain/constants/README.md)

## 🎓 Usage Patterns

### Start Video Generation
1. Import service
2. Call `startOperation()` with model, API key, and prompt
3. Save returned operation name
4. Use operation name for polling
5. Handle network errors

### Query Operation Status
1. Import service
2. Call `getOperation()` with operation name
3. Check `done` field for completion
4. Check `error` field for failures
5. Extract video URL from response when complete

### Custom Polling Logic
1. Start operation with `startOperation()`
2. Poll with `getOperation()` in loop
3. Check completion status each iteration
4. Handle progress updates
5. Exit when complete or failed

## 🚨 Common Pitfalls

### Don't
- Poll manually (use veo-polling.service.ts)
- Forget to save operation name
- Ignore operation error field
- Expose API keys in logs
- Poll too frequently (rate limits)

### Do
- Save operation name immediately
- Use polling service for automatic polling
- Check error field in responses
- Implement backoff between polls
- Handle network errors gracefully
- Validate API responses

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../AI_GUIDELINES.md)
