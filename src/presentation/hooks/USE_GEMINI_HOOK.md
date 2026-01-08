# useGemini Hook

React hook for Gemini AI text generation with image support. Provides a simple interface for generating content with loading states, error handling, and result management.

## 📍 File Path

[`use-gemini.ts`](./use-gemini.ts)

## 🎯 Purpose

Use this hook to integrate Gemini AI text generation into React Native components. Manages state and provides methods for AI operations.

**When to use:**
- Generate AI text in components
- Implement AI-powered features
- Create chat interfaces
- Build AI-assisted forms
- Add image analysis to UI

## 📌 Strategy

Hook abstracts complexity of AI operations. This hook:
- Manages loading, error, and result state
- Provides simple methods for generation
- Handles image-based generation
- Supports configuration and callbacks
- Enables easy UI integration

**Key Decision**: Use this hook for React Native UI components. It provides a clean, React-friendly interface to Gemini AI services.

## ⚠️ Rules

### Usage Rules
- **MUST** initialize provider before using hook
- **MUST** call hook only in React components
- **SHOULD** handle all states (loading, error, result)
- **MUST** provide user feedback
- **SHOULD NOT** use hook outside React functions

### State Management Rules
- **SHOULD** display loading indicators during generation
- **MUST** handle and display errors
- **SHOULD** implement success callbacks
- **MUST** reset state when appropriate
- **SHOULD** cleanup on unmount

### Configuration Rules
- **MUST** use valid model IDs
- **SHOULD** select appropriate model for use case
- **MUST** configure generation parameters appropriately
- **SHOULD** implement callbacks for side effects
- **MUST NOT** hardcode model IDs

## 🤖 AI Agent Guidelines

### When Modifying This Hook
1. **READ** the implementation file first
2. **UNDERSTAND** React hook patterns
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new functionality
5. **UPDATE** type definitions

### When Adding New Features
1. **CHECK** if feature exists in hooks or services
2. **FOLLOW** existing hook patterns
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
- **FOLLOW** React hooks rules
- **USE** useMemo/useCallback for optimization
- **VALIDATE** inputs
- **HANDLE** errors gracefully
- **COMMENT** complex logic only

## 📦 Available Methods

### Hook Return Values

The hook returns an object with:
- `generate(prompt)`: Generate text from prompt
- `generateWithImage(prompt, imageBase64, mimeType)`: Generate with image context
- `result`: Generated text (null if no result)
- `isGenerating`: Loading state
- `error`: Error message (null if no error)
- `reset()`: Clear all state

**Refer to**: [`use-gemini.ts`](./use-gemini.ts)

## 🔗 Related Modules

- **Text Generation Service**: [`../../infrastructure/services/TEXT_GENERATION_SERVICE.md`](../../infrastructure/services/TEXT_GENERATION_SERVICE.md)
- **Image Edit Service**: [`../../infrastructure/services/IMAGE_EDIT_SERVICE.md`](../../infrastructure/services/IMAGE_EDIT_SERVICE.md)
- **Hooks Overview**: [`README.md`](./README.md)

## 📋 Configuration Reference

### UseGeminiOptions

Configuration interface found in: [`use-gemini.ts`](./use-gemini.ts)

**Options:**
- `model`: string - Model ID (default: 'gemini-1.5-flash')
- `generationConfig`: object - Generation parameters (temperature, maxTokens, etc.)
- `onSuccess`: (result: string) => void - Success callback
- `onError`: (error: string) => void - Error callback

### Model Selection

See available models in: [`../../infrastructure/services/FEATURE_MODEL_SELECTOR_SERVICE.md`](../../infrastructure/services/FEATURE_MODEL_SELECTOR_SERVICE.md)

## 🎓 Usage Patterns

### Basic Text Generation
1. Import hook in component
2. Call `useGemini()` hook
3. Use `generate()` method with prompt
4. Display `isGenerating`, `error`, and `result` states
5. Handle user interactions

### Custom Model
1. Import hook
2. Call `useGemini()` with model option
3. Select appropriate model ID
4. Use hook methods normally
5. Handle responses

### With Generation Config
1. Import hook
2. Configure `generationConfig` option
3. Set temperature, max tokens, etc.
4. Use hook for generation
5. Handle responses

### With Callbacks
1. Import hook
2. Implement `onSuccess` callback
3. Implement `onError` callback
4. Handle side effects in callbacks
5. Use hook for generation

### Image-Based Generation
1. Import hook
2. Prepare base64 image data
3. Call `generateWithImage()` with prompt and image
4. Handle loading and result states
5. Display result

### Form Integration
1. Import hook
2. Create form with input fields
3. Call generation on form submit
4. Display states appropriately
5. Handle success/error

### Chat Interface
1. Import hook
2. Maintain messages array in state
3. Call `generate()` for each user message
4. Add result to messages
5. Display conversation

### Error Handling
1. Import hook
2. Configure `onError` callback
3. Check error types in callback
4. Show appropriate messages
5. Implement retry logic

### Auto-Generate on Mount
1. Import hook
2. Use `useEffect()` hook
3. Call `generate()` in effect
4. Handle result and error
5. Display to user

### Retry Logic
1. Import hook
2. Implement retry counter
3. Call `generate()` with backoff
4. Track attempts
5. Handle final failure

### Debounced Input
1. Import hook
2. Implement debounce utility
3. Call debounced generation
4. Handle delayed results
5. Update UI appropriately

### Streaming Simulation
1. Import hook
2. Use `generate()` to get result
3. Implement streaming display effect
4. Update state progressively
5. Display to user

## 🚨 Common Pitfalls

### Don't
- Forget to check loading state
- Ignore error states
- Use hook outside React functions
- Skip cleanup on unmount
- Hardcode model IDs

### Do
- Always display loading indicator
- Handle all error states
- Implement success callbacks
- Reset state when needed
- Provide user feedback
- Cleanup on unmount

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../AI_GUIDELINES.md)
