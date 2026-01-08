# Streaming Service

Provides real-time streaming for AI text generation. Delivers responses chunk-by-chunk for immediate display.

## 📍 Import Path

```
import { geminiStreamingService } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use this service to generate AI text responses with streaming. Provides immediate feedback as content is generated, improving user experience for long responses.

**When to use:**
- Long text generation (stories, articles)
- Chat interfaces requiring real-time responses
- Applications needing immediate user feedback
- Progressive content display
- Cancelable operations

## 📌 Strategy

Streaming dramatically improves UX for long responses. This service:
- Returns AsyncGenerator for chunk-by-chunk delivery
- Enables progressive UI updates
- Supports cancellation mid-generation
- Handles stream errors gracefully
- Provides finish reason for completion status

**Key Decision**: Use streaming for better UX when generating long responses. Each chunk can be displayed immediately, reducing perceived latency.

## ⚠️ Rules

### Usage Rules
- **MUST** initialize provider with API key before use
- **MUST** iterate through async generator properly
- **SHOULD** update UI with each chunk
- **MUST** handle stream errors appropriately
- **SHOULD** implement cancellation support

### Stream Handling Rules
- **MUST** use `for await` to consume stream
- **SHOULD** buffer very small chunks
- **MUST** check `finishReason` in final chunk
- **SHOULD** implement memory limits for buffers
- **MUST NOT** ignore stream errors

### Configuration Rules
- **MUST** use valid model IDs
- **SHOULD** configure appropriate generation parameters
- **MUST** handle safety filters in stream
- **SHOULD** implement retry logic for failures

### Error Handling Rules
- **MUST** catch and handle `GeminiError`
- **MUST** handle stream interruption errors
- **SHOULD** check finish reasons (SAFETY, MAX_TOKENS)
- **MUST NOT** expose API keys in errors

## 🤖 AI Agent Guidelines

### When Modifying This Service
1. **READ** the implementation file first
2. **UNDERSTAND** async generator pattern
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new functionality
5. **UPDATE** type definitions

### When Adding New Features
1. **CHECK** if similar feature exists in streaming/text services
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
- **USE** async/await and `for await`
- **VALIDATE** inputs at function entry
- **THROW** typed errors (`GeminiError`)
- **LOG** important operations
- **COMMENT** complex logic only

## 📦 Available Methods

### `streamText(model, prompt, config?)`

Stream text generation chunk-by-chunk.

**Refer to**: [`gemini-streaming.service.ts`](./gemini-streaming.service.ts)

## 🔗 Related Modules

- **Domain Types**: [`domain/entities/README.md`](../domain/entities/README.md)
- **Text Generation**: [`TEXT_GENERATION_SERVICE.md`](./TEXT_GENERATION_SERVICE.md)
- **Core Client**: [`CORE_CLIENT_SERVICE.md`](./CORE_CLIENT_SERVICE.md)

## 📋 Configuration Reference

### Generation Config
See: [`domain/entities/README.md`](../domain/entities/README.md)

### Model Selection
See: [`FEATURE_MODEL_SELECTOR_SERVICE.md`](./FEATURE_MODEL_SELECTOR_SERVICE.md)

### Error Types
See: [`ERROR_UTILITIES.md`](../infrastructure/utils/ERROR_UTILITIES.md)

## 🎓 Usage Patterns

### Basic Streaming
1. Import service
2. Call `streamText()` with model and prompt
3. Use `for await` to iterate through chunks
4. Append each chunk to displayed text
5. Handle completion or errors

### With UI Updates
1. Create state for streamed text
2. Start streaming with `streamText()`
3. Update state with each chunk
4. Display progress to user
5. Handle final chunk and finish reason

### With Cancellation
1. Start streaming operation
2. Track cancellation flag
3. Check flag in stream loop
4. Break loop if cancelled
5. Handle cleanup appropriately

### With Error Handling
1. Wrap stream in try-catch
2. Check `finishReason` in chunks
3. Handle SAFETY, MAX_TOKENS reasons
4. Catch network and timeout errors
5. Provide user feedback

## 🚨 Common Pitfalls

### Don't
- Buffer all chunks before displaying (defeats streaming purpose)
- Ignore finish reasons in final chunk
- Forget error handling in stream loop
- Create memory leaks with unbounded buffers
- Assume streaming is always faster

### Do
- Update UI with each chunk
- Check finishReason for completion status
- Handle stream interruption gracefully
- Implement buffer size limits
- Use cancellation for long operations
- Provide user feedback during streaming

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../AI_GUIDELINES.md)
