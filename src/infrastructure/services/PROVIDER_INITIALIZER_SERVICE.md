# Provider Initializer Service

Service for initializing and configuring the Gemini Provider. Handles setup of the core client with provider-specific configuration.

## 📍 Import Path

```
import { providerInitializer } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use provider initializer to configure and set up the Gemini provider before using any services. Initializes core client with API keys and configuration.

**When to use:**
- Initialize provider on application startup
- Configure retry and timeout settings
- Set default models for different features
- Reset provider for testing
- Verify initialization status

## 📌 Strategy

Provider must be initialized before any AI operations. This service:
- Initializes singleton core client
- Configures retry and timeout behavior
- Sets default models for features
- Prevents duplicate initialization
- Provides reset capability for testing
- Validates configuration

**Key Decision**: Initialize provider once at application startup. Use `isInitialized()` to verify before operations.

## ⚠️ Rules

### Initialization Rules
- **MUST** initialize before using any service
- **SHOULD** initialize on app startup
- **MUST** provide valid API key
- **SHOULD** check initialization status
- **MUST NOT** reinitialize unnecessarily

### Configuration Rules
- **MUST** provide API key (required field)
- **SHOULD** set appropriate retry limits
- **MUST** configure timeouts appropriately
- **SHOULD** use environment variables for secrets
- **MUST NOT** hardcode API keys

### API Key Rules
- **MUST** store API keys securely
- **SHOULD** use environment variables
- **MUST NOT** commit API keys to version control
- **SHOULD** rotate keys periodically
- **MUST** validate key format

### Reset Rules
- **SHOULD** only reset for testing
- **MUST NOT** reset in production
- **SHOULD** reinitialize after reset
- **MUST** handle reset errors
- **SHOULD** warn before resetting

## 🤖 AI Agent Guidelines

### When Initializing Provider
1. **CALL** initialize() with configuration
2. **PROVIDE** valid API key
3. **SET** appropriate retry/timeout values
4. **CONFIGURE** default models
5. **VERIFY** initialization success

### When Checking Status
1. **CALL** isInitialized() before operations
2. **THROW** error if not initialized
3. **INITIALIZE** if not ready
4. **LOG** initialization status
5. **HANDLE** initialization errors

### When Resetting Provider
1. **USE** only in test environments
2. **CALL** reset() to clear state
3. **REINITIALIZE** with new config
4. **VERIFY** reset success
5. **CLEAN UP** resources

### Code Style Rules
- **INITIALIZE** early in app lifecycle
- **VALIDATE** configuration before initialization
- **HANDLE** initialization errors
- **LOG** initialization in development
- **USE** environment variables for secrets

## 📦 Available Service

### providerInitializer

**Refer to**: [`provider-initializer.ts`](./provider-initializer.ts)

**Singleton instance**

**Methods:**
- `initialize(config)` - Initialize provider with configuration
- `isInitialized()` - Check if provider is initialized
- `reset()` - Reset provider state

## 🔗 Related Modules

- **Core Client**: [`CORE_CLIENT_SERVICE.md`](./CORE_CLIENT_SERVICE.md)
- **Domain Types**: [`../../domain/README.md`](../../domain/README.md)
- **Services README**: [`./README.md`](./README.md)

## 📋 Configuration

### Required Fields
- `apiKey`: Google Cloud API key

### Optional Fields
- `maxRetries`: Maximum retry attempts (default: from core config)
- `baseDelay`: Base delay for retries in ms (default: from core config)
- `maxDelay`: Maximum delay for retries in ms (default: from core config)
- `defaultTimeoutMs`: Default timeout for requests in ms (default: from core config)
- `textModel`: Default model for text generation
- `textToImageModel`: Default model for image generation
- `imageEditModel`: Default model for image editing

## 🎓 Usage Patterns

### Basic Initialization
1. Import providerInitializer
2. Call initialize() with API key
3. Verify initialization success
4. Use Gemini services normally
5. Handle initialization errors

### Full Configuration
1. Create configuration object
2. Set API key and models
3. Configure retry/timeout values
4. Initialize provider
5. Verify all settings

### React Native Integration
1. Import in App component
2. Initialize in useEffect
3. Set loading state
4. Handle errors
5. Render app when ready

### Environment-Based Configuration
1. Detect environment (dev/prod)
2. Select appropriate configuration
3. Initialize with environment settings
4. Log configuration in development
5. Use appropriate models

## 🚨 Common Pitfalls

### Don't
- Initialize provider before every operation
- Hardcode API keys in source code
- Skip initialization status checks
- Use invalid API keys
- Reset provider in production

### Do
- Initialize once at app startup
- Use environment variables for API keys
- Check initialization status before use
- Validate configuration format
- Handle initialization errors gracefully

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
