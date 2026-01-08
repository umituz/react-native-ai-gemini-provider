# Core Client Service

Low-level communication with Google Gemini SDK. Handles model loading, configuration, and SDK management.

## 📍 Import Path

```
import { geminiClientCoreService } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use this service to initialize and configure the Gemini SDK. Manages the underlying Gemini client instance and provides access to configured models.

**When to use:**
- Initialize Gemini SDK with API key
- Configure default models for different features
- Access Gemini model instances directly
- Update SDK configuration at runtime
- Validate SDK initialization status

## 📌 Strategy

Core client acts as the foundation for all Gemini operations. This service:
- Implements singleton pattern for single SDK instance
- Manages SDK lifecycle (initialization, configuration)
- Provides typed model instances
- Handles API key and endpoint configuration
- Validates initialization before operations

**Key Decision**: Use singleton pattern to ensure single Gemini SDK instance. All other services use this core client for model access.

## ⚠️ Rules

### Usage Rules
- **MUST** initialize before any Gemini operations
- **MUST** provide valid API key in configuration
- **SHOULD** initialize once at application startup
- **MUST NOT** create multiple instances (use singleton)
- **SHOULD** validate initialization before use

### Configuration Rules
- **MUST** set API key (required field)
- **SHOULD** configure appropriate models for features
- **MUST NOT** expose API keys in logs or errors
- **SHOULD** set reasonable retry limits
- **MUST** use valid model IDs

### Error Handling Rules
- **MUST** validate configuration before initialization
- **MUST** handle initialization errors appropriately
- **SHOULD** provide clear error messages
- **MUST** throw errors for invalid API keys
- **SHOULD** log initialization status in development

## 🤖 AI Agent Guidelines

### When Modifying This Service
1. **READ** the implementation file first
2. **UNDERSTAND** singleton pattern
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new functionality
5. **UPDATE** type definitions

### When Adding New Features
1. **CHECK** if feature exists in other services
2. **FOLLOW** existing initialization patterns
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
- **USE** singleton pattern
- **VALIDATE** all inputs
- **THROW** typed errors
- **LOG** important operations
- **COMMENT** complex logic only

## 📦 Available Methods

### `initialize(config)`

Initialize Gemini client with configuration.

**Refer to**: [`gemini-client-core.service.ts`](./gemini-client-core.service.ts)

### `getModel(model)`

Get Gemini model instance by ID.

**Refer to**: [`gemini-client-core.service.ts`](./gemini-client-core.service.ts)

### `getConfig()`

Get current configuration.

**Refer to**: [`gemini-client-core.service.ts`](./gemini-client-core.service.ts)

### `isInitialized()`

Check if service is initialized.

**Refer to**: [`gemini-client-core.service.ts`](./gemini-client-core.service.ts)

### `validateInitialization()`

Validate initialization, throw error if not initialized.

**Refer to**: [`gemini-client-core.service.ts`](./gemini-client-core.service.ts)

### `updateConfig(config)`

Update configuration at runtime.

**Refer to**: [`gemini-client-core.service.ts`](./gemini-client-core.service.ts)

## 🔗 Related Modules

- **Domain Types**: [`domain/entities/README.md`](../domain/entities/README.md)
- **Text Generation**: [`TEXT_GENERATION_SERVICE.md`](./TEXT_GENERATION_SERVICE.md)
- **Image Generation**: [`IMAGE_GENERATION_SERVICE.md`](./IMAGE_GENERATION_SERVICE.md)
- **Video Generation**: [`VIDEO_GENERATION_SERVICE.md`](./VIDEO_GENERATION_SERVICE.md)

## 📋 Configuration Reference

### GeminiConfig

Configuration interface definition found in: [`domain/entities/README.md`](../domain/entities/README.md)

**Required Fields:**
- `apiKey`: string - API key from Google Cloud Console

**Optional Fields:**
- `baseUrl`: string - Custom base URL for API requests
- `maxRetries`: number - Maximum retry attempts (default: 3)
- `baseDelay`: number - Initial retry delay in ms (default: 1000)
- `maxDelay`: number - Maximum retry delay in ms (default: 10000)
- `defaultTimeoutMs`: number - Request timeout in ms
- `textModel`: string - Default text generation model
- `textToImageModel`: string - Default image generation model
- `imageEditModel`: string - Default image editing model
- `videoGenerationModel`: string - Default video generation model

### Supported Models

See model IDs in: [`domain/constants/README.md`](../domain/constants/README.md)

## 🎓 Usage Patterns

### Basic Initialization
1. Import service
2. Call `initialize()` with API key
3. Verify initialization with `isInitialized()`
4. Use services normally

### Advanced Configuration
1. Prepare configuration object with all settings
2. Include model IDs for each feature
3. Set retry and timeout parameters
4. Call `initialize()` with configuration
5. Validate initialization succeeded

### Runtime Configuration Updates
1. Check current configuration with `getConfig()`
2. Prepare partial config update
3. Call `updateConfig()` with new values
4. Verify changes applied

### Direct Model Access
1. Ensure service is initialized
2. Call `getModel()` with model ID
3. Use returned model instance directly
4. Handle model errors appropriately

## 🚨 Common Pitfalls

### Don't
- Initialize multiple times
- Create new instances (use singleton)
- Skip initialization validation
- Expose API keys in logs
- Use uninitialized service

### Do
- Initialize once at app startup
- Use singleton instance
- Validate before use
- Handle initialization errors
- Set appropriate model IDs
- Configure reasonable timeouts

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../AI_GUIDELINES.md)
