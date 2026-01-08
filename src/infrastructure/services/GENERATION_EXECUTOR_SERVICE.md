# Generation Executor Service

Service for executing different types of AI generation tasks. Handles text, image, and video generation with a unified interface.

## 📍 Import Path

```
import { generationExecutor } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use generation executor to execute AI generation tasks with a unified interface. Automatically detects generation type and routes to appropriate service.

**When to use:**
- Execute text, image, or video generation
- Use unified generation interface
- Handle multiple generation types
- Simplify service integration
- Abstract generation complexity

## 📌 Strategy

Unified interface simplifies integration. This service:
- Detects generation type automatically
- Routes to appropriate service
- Provides consistent interface
- Handles response formatting
- Simplifies error handling

**Key Decision**: Use executor for generic generation needs. Use specific services for direct control.

## ⚠️ Rules

### Usage Rules
- **MUST** specify generation type in input
- **SHOULD** use executor for generic operations
- **MUST** handle typed responses correctly
- **SHOULD** validate input parameters
- **MUST NOT** mix generation types

### Type Detection Rules
- **MUST** specify input type explicitly
- **SHOULD** use appropriate input structure
- **MUST** match type to service
- **SHOULD** validate type compatibility
- **MUST NOT** rely on implicit detection

### Response Rules
- **MUST** handle response types correctly
- **SHOULD** validate response structure
- **MUST** check for errors
- **SHOULD** parse responses appropriately
- **MUST NOT** assume response format

### Error Handling Rules
- **MUST** catch generation errors
- **SHOULD** provide meaningful error messages
- **MUST** handle service-specific errors
- **SHOULD** log errors appropriately
- **MUST NOT** suppress errors

## 🤖 AI Agent Guidelines

### When Executing Generations
1. **DETERMINE** generation type
2. **PREPARE** input structure
3. **CALL** executeGeneration()
4. **HANDLE** typed response
5. **PROCESS** result appropriately

### When Using Typed Generations
1. **SPECIFY** type parameter
2. **PROVIDE** correct input
3. **CAST** response appropriately
4. **VALIDATE** response type
5. **USE** result safely

### When Handling Errors
1. **WRAP** execution in try-catch
2. **CHECK** error type
3. **HANDLE** service-specific errors
4. **PROVIDE** fallback behavior
5. **LOG** error details

### Code Style Rules
- **SPECIFY** generation type explicitly
- **USE** type parameters correctly
- **HANDLE** all error cases
- **VALIDATE** input structure
- **DOCUMENT** generation usage

## 📦 Available Service

### generationExecutor

**Refer to**: [`generation-executor.ts`](./generation-executor.ts)

**Methods:**
- `executeGeneration<T>(model, input, options?)` - Execute generation task
- `generateWithImages(model, prompt, images)` - Generate with image context

## 🔗 Related Modules

- **Text Generation**: [`TEXT_GENERATION_SERVICE.md`](./TEXT_GENERATION_SERVICE.md)
- **Image Generation**: [`IMAGE_GENERATION_SERVICE.md`](./IMAGE_GENERATION_SERVICE.md)
- **Video Generation**: [`VIDEO_GENERATION_SERVICE.md`](./VIDEO_GENERATION_SERVICE.md)
- **Job Processor**: [`JOB_PROCESSOR_SERVICE.md`](./JOB_PROCESSOR_SERVICE.md)

## 📋 Generation Types

### Text Generation
- Type: `text`
- Input: `{ type: 'text', prompt: string }`
- Returns: `{ text: string; response: unknown }`

### Image Generation
- Type: `image`
- Input: `{ type: 'image', prompt: string }`
- Returns: `{ imageUrl: string; response: unknown }`

### Video Generation
- Type: `video`
- Input: `{ type: 'video', prompt: string }`
- Returns: `{ videoUrl: string; response: unknown }`

## 🎓 Usage Patterns

### Basic Generation
1. Determine generation type
2. Prepare input structure
3. Call executeGeneration()
4. Get typed response
5. Use result

### Typed Generation
1. Specify type parameter
2. Provide correct input
3. Execute generation
4. Validate response type
5. Use result safely

### Image Context Generation
1. Call generateWithImages()
2. Provide prompt and images
3. Get text response
4. Handle multimodal result
5. Process response

### Error Handling
1. Wrap execution in try-catch
2. Check error type
3. Handle specific errors
4. Provide fallback
5. Log errors

## 🚨 Common Pitfalls

### Don't
- Skip type specification
- Mix generation types
- Assume response format
- Suppress errors
- Use wrong input structure

### Do
- Always specify type
- Use correct input structure
- Handle all error cases
- Validate responses
- Use type parameters correctly

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
