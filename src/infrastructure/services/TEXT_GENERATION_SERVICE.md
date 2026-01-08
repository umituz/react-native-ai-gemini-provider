# Text Generation Service

Generates text content using Google Gemini API models.

## 📍 Import Path

```
import { geminiTextGenerationService } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use this service to generate AI-powered text content. Supports single prompts, conversational interfaces, and multimodal input with images.

**When to use:**
- Text generation (stories, summaries, translations)
- Chat interfaces and conversational AI
- Content analysis with images
- Any text-based AI generation task

## 📌 Strategy

Text generation is the foundation of most AI interactions. This service:
- Abstracts Gemini API complexity
- Provides type-safe interfaces
- Handles errors consistently
- Supports streaming for real-time responses
- Integrates with retry logic

**Key Decision**: We use streaming by default for better UX, but fallback to non-streaming for compatibility.

## ⚠️ Rules

### Usage Rules
- **MUST** initialize provider with API key before use
- **MUST** handle errors appropriately
- **MUST** validate model IDs before use
- **SHOULD** use streaming for long responses
- **MUST NOT** exceed rate limits

### Configuration Rules
- **MUST** set appropriate `maxOutputTokens`
- **SHOULD** adjust `temperature` based on use case
- **MUST** use valid model IDs
- **SHOULD** implement retry logic for failures

### Error Handling Rules
- **MUST** catch and handle `GeminiError`
- **MUST** provide user-friendly error messages
- **SHOULD** log errors for debugging
- **MUST NOT** expose API keys in errors

## 🤖 AI Agent Guidelines

### When Modifying This Service
1. **READ** the implementation file first
2. **UNDERSTAND** current error handling
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new functionality
5. **UPDATE** type definitions

### When Adding New Features
1. **CHECK** if similar feature exists
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

### `generateText(model, prompt, config?)`
Generate text from a prompt.

**Refer to**: [`gemini-text-generation.service.ts`](./gemini-text-generation.service.ts)

### `generateContent(model, contents, config?)`
Generate content with structured messages.

**Refer to**: [`gemini-text-generation.service.ts`](./gemini-text-generation.service.ts)

### `generateWithImages(model, prompt, images, config?)`
Generate text with image context.

**Refer to**: [`gemini-text-generation.service.ts`](./gemini-text-generation.service.ts)

### `generateTextStream(model, prompt, config?)`
Generate text with streaming response.

**Refer to**: [`gemini-text-generation.service.ts`](./gemini-text-generation.service.ts)

## 🔗 Related Modules

- **Domain Types**: [`domain/entities/README.md`](../domain/entities/README.md)
- **Image Generation**: [`IMAGE_GENERATION_SERVICE.md`](./IMAGE_GENERATION_SERVICE.md)
- **Retry Service**: [`RETRY_SERVICE.md`](./RETRY_SERVICE.md)
- **Streaming Service**: [`STREAMING_SERVICE.md`](./STREAMING_SERVICE.md)

## 📋 Configuration Reference

### Generation Config
See: [`domain/entities/README.md`](../domain/entities/README.md)

### Model Selection
See: [`FEATURE_MODEL_SELECTOR_SERVICE.md`](./FEATURE_MODEL_SELECTOR_SERVICE.md)

### Error Types
See: [`ERROR_UTILITIES.md`](../infrastructure/utils/ERROR_UTILITIES.md)

## 🎓 Usage Patterns

### Basic Generation
1. Import service
2. Call `generateText()` with model and prompt
3. Handle response or error
4. Display result to user

### With Retry Logic
1. Use retry service wrapper
2. Configure max retries and delays
3. Handle retryable errors
4. Provide feedback to user

### Streaming
1. Use `generateTextStream()`
2. Handle chunks in callback
3. Update UI progressively
4. Handle stream completion

## 🚨 Common Pitfalls

### Don't
- Use hardcoded model IDs
- Ignore error handling
- Exceed rate limits
- Skip initialization

### Do
- Use feature model selector
- Handle all errors
- Implement backoff
- Initialize provider

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../AI_GUIDELINES.md)
