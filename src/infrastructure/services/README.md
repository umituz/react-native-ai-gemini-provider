# Services Layer

Communication layer with Gemini API. Contains all business logic for text, image, and video generation.

## 📍 Import Path

```
import {
  geminiClientCoreService,
  geminiTextGenerationService,
  geminiImageGenerationService,
  geminiImageEditService,
  geminiVideoGenerationService,
  geminiStreamingService,
  geminiRetryService,
  providerInitializer,
  featureModelSelector
} from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use services to execute AI operations. Each service handles specific AI capabilities with proper error handling and retry logic.

**When to use:**
- Generate text content
- Create images from text
- Edit and transform images
- Generate videos
- Stream real-time responses
- Handle AI errors and retries

## 📌 Strategy

Services encapsulate API communication logic. This layer:
- Provides high-level interfaces for AI operations
- Handles error detection and retry logic
- Manages API communication complexity
- Implements feature-based model selection
- Supports both simple and advanced use cases

**Key Decision**: Use services for all AI operations. They handle complexity, errors, and optimization automatically.

## ⚠️ Rules

### Usage Rules
- **MUST** initialize provider before using services
- **SHOULD** use appropriate service for operation type
- **MUST** handle service errors appropriately
- **SHOULD** check model validation
- **MUST NOT** bypass error handling

### Error Handling Rules
- **MUST** catch and handle `GeminiError`
- **SHOULD** implement retry logic for transient errors
- **MUST** provide user-friendly error messages
- **SHOULD** log errors for debugging
- **MUST NOT** expose API keys in errors

### Configuration Rules
- **MUST** use valid model IDs
- **SHOULD** configure appropriate generation parameters
- **MUST** respect API rate limits
- **SHOULD** implement timeouts for long operations
- **MUST NOT** use deprecated models

### Model Selection Rules
- **SHOULD** use feature-based model selector
- **MUST** validate model before use
- **SHOULD** consider user tier for model selection
- **MUST NOT** hardcode model IDs in application code

## 🤖 AI Agent Guidelines

### When Modifying Services
1. **READ** the implementation file first
2. **UNDERSTAND** service dependencies
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new functionality
5. **UPDATE** all documentation

### When Adding New Services
1. **CHECK** if similar service exists
2. **FOLLOW** existing service patterns
3. **USE** established error handling
4. **DOCUMENT** in service documentation
5. **ADD** examples to tests (not docs)

### When Fixing Service Bugs
1. **REPRODUCE** bug locally first
2. **IDENTIFY** root cause
3. **FIX** with minimal changes
4. **ADD** regression test
5. **VERIFY** all tests pass

### Code Style Rules
- **USE** async/await (no callbacks)
- **VALIDATE** inputs at service entry
- **THROW** typed errors (`GeminiError`)
- **LOG** important operations
- **COMMENT** complex logic only

## 📦 Available Services

### Core Services

**Text Generation**: Generate AI text content

**Refer to**: [`TEXT_GENERATION_SERVICE.md`](./TEXT_GENERATION_SERVICE.md)

**Image Generation**: Create images from text prompts

**Refer to**: [`IMAGE_GENERATION_SERVICE.md`](./IMAGE_GENERATION_SERVICE.md)

**Image Edit**: Edit and transform images

**Refer to**: [`IMAGE_EDIT_SERVICE.md`](./IMAGE_EDIT_SERVICE.md)

**Video Generation**: Generate videos from text/images

**Refer to**: [`VIDEO_GENERATION_SERVICE.md`](./VIDEO_GENERATION_SERVICE.md)

**Streaming**: Real-time text streaming

**Refer to**: [`STREAMING_SERVICE.md`](./STREAMING_SERVICE.md)

**Retry**: Automatic retry with backoff

**Refer to**: [`RETRY_SERVICE.md`](./RETRY_SERVICE.md)

### Support Services

**Core Client**: Low-level SDK communication

**Refer to**: [`CORE_CLIENT_SERVICE.md`](./CORE_CLIENT_SERVICE.md)

**Feature Model Selector**: Feature-based model selection

**Refer to**: [`FEATURE_MODEL_SELECTOR_SERVICE.md`](./FEATURE_MODEL_SELECTOR_SERVICE.md)

**Provider Initializer**: Provider initialization

**Refer to**: [`PROVIDER_INITIALIZER_SERVICE.md`](./PROVIDER_INITIALIZER_SERVICE.md)

## 🔗 Related Modules

- **Domain Types**: [`../../domain/README.md`](../../domain/README.md)
- **Infrastructure**: [`../infrastructure/README.md`](../infrastructure/README.md)
- **Presentation**: [`../presentation/README.md`](../presentation/README.md)

## 📋 Service Categories

### Text Services
- Text generation (simple and structured)
- Multimodal content (text + images)
- Streaming responses
- Conversational AI

### Image Services
- Text-to-image generation
- Image editing and transformation
- Background removal
- Image enhancement
- Style transfer

### Video Services
- Text-to-video generation
- Image-to-video generation
- Progress tracking
- Polling mechanism

### Infrastructure Services
- SDK client management
- Error handling and retry
- Model selection and validation
- Provider initialization

## 🎓 Usage Patterns

### Basic Text Generation
1. Import `geminiTextGenerationService`
2. Call `generateText()` with model and prompt
3. Handle response or error
4. Display result to user

### Image Generation
1. Import `geminiImageGenerationService`
2. Call `generateImage()` with descriptive prompt
3. Handle image data (URL or base64)
4. Display image in UI

### Video Generation
1. Import `geminiVideoGenerationService`
2. Call `generateTextToVideo()` with prompt
3. Provide progress callback
4. Monitor progress
5. Handle completion

### Error Handling
1. Wrap service call in try-catch
2. Check if error is `GeminiError`
3. Switch on error type
4. Handle each error type appropriately
5. Provide user feedback

### Streaming
1. Import `geminiStreamingService`
2. Call `streamText()` with model and prompt
3. Use `for await` to consume stream
4. Display chunks progressively
5. Handle completion

## 🚨 Common Pitfalls

### Don't
- Use services without initializing provider
- Ignore error handling
- Hardcode model IDs
- Exceed API rate limits
- Skip progress callbacks for long operations

### Do
- Initialize provider before using services
- Handle all error types
- Use feature model selector
- Implement retry logic
- Provide user feedback
- Monitor long operations

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../AI_GUIDELINES.md)
