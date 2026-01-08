# React Hooks Overview

React hooks for integrating Gemini AI functionality into React Native applications.

## 📍 Import Path

```
import { useGemini } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use React hooks to easily integrate Gemini AI functionality into React Native components. Provides state management for AI operations.

**When to use:**
- Add text generation to components
- Implement AI-powered features
- Handle AI state in React components
- Create chat interfaces
- Build AI-assisted forms

## 📌 Strategy

React hooks simplify AI integration by managing state automatically. These hooks:
- Manage loading, error, and result states
- Provide callbacks for success/error handling
- Support configuration and model selection
- Handle lifecycle and cleanup
- Enable type-safe AI operations

**Key Decision**: Use hooks for React Native UI components. Use services directly for non-UI logic or complex state management needs.

## ⚠️ Rules

### Usage Rules
- **MUST** initialize provider before using hooks
- **SHOULD** use hooks only in React components
- **MUST** handle loading and error states
- **SHOULD** implement cleanup on unmount
- **MUST NOT** use hooks outside React functions

### State Management Rules
- **SHOULD** display loading indicators
- **MUST** handle errors appropriately
- **SHOULD** provide user feedback
- **MUST** reset state when needed
- **SHOULD NOT** ignore error states

### Configuration Rules
- **SHOULD** select appropriate model for use case
- **MUST** use valid model IDs
- **SHOULD** configure generation parameters appropriately
- **MUST** validate inputs before generation
- **SHOULD** implement success/error callbacks

## 🤖 AI Agent Guidelines

### When Modifying These Hooks
1. **READ** the implementation file first
2. **UNDERSTAND** React hook patterns
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new functionality
5. **UPDATE** type definitions

### When Adding New Features
1. **CHECK** if similar hook exists
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
- **VALIDATE** inputs at hook entry
- **HANDLE** errors gracefully
- **LOG** important operations
- **COMMENT** complex logic only

## 📦 Available Hooks

### `useGemini(options?)`

React hook for text and image-based generation with Gemini AI.

**Refer to**: [`use-gemini.ts`](./use-gemini.ts)

**Detailed documentation**: [`USE_GEMINI_HOOK.md`](./USE_GEMINI_HOOK.md)

## 🔗 Related Modules

- **Text Generation Service**: [`../../infrastructure/services/TEXT_GENERATION_SERVICE.md`](../../infrastructure/services/TEXT_GENERATION_SERVICE.md)
- **Domain Types**: [`../../domain/entities/README.md`](../../domain/entities/README.md)
- **Provider Initialization**: [`../../infrastructure/services/PROVIDER_INITIALIZER_SERVICE.md`](../../infrastructure/services/PROVIDER_INITIALIZER_SERVICE.md)

## 📋 Configuration Reference

### UseGeminiOptions

Configuration options found in: [`use-gemini.ts`](./use-gemini.ts)

**Optional Fields:**
- `model`: string - Model ID to use
- `generationConfig`: object - Generation parameters
- `onSuccess`: (result: string) => void - Success callback
- `onError`: (error: string) => void - Error callback

### Return Values

Hook returns object with:
- `generate`: (prompt: string) => Promise<void> - Start text generation
- `generateWithImage`: (prompt, imageBase64, mimeType) => Promise<void> - Start image-based generation
- `result`: string | null - Generated text
- `isGenerating`: boolean - Loading state
- `error`: string | null - Error message
- `reset`: () => void - Reset all state

## 🎓 Usage Patterns

### Basic Text Generation
1. Import hook in component
2. Call `useGemini()` hook
3. Use `generate()` with prompt
4. Display loading, error, and result states
5. Handle user interactions

### With Model Selection
1. Import hook
2. Call `useGemini()` with model option
3. Select appropriate model for use case
4. Use hook methods normally
5. Handle responses

### With Callbacks
1. Import hook
2. Configure `onSuccess` callback
3. Configure `onError` callback
4. Use hook for generation
5. Handle callbacks appropriately

### Image Analysis
1. Import hook
2. Use `generateWithImage()` method
3. Provide prompt and base64 image data
4. Handle image analysis result
5. Display result to user

### Chat Interface
1. Import hook
2. Manage messages array in component state
3. Call `generate()` for each user message
4. Update messages on result
5. Display conversation

### State Management
1. Import hook
2. Use `reset()` to clear state
3. Implement cleanup on unmount
4. Handle loading and error states
5. Provide user feedback

## 🚨 Common Pitfalls

### Don't
- Use hooks outside React functions
- Forget to handle loading states
- Ignore error states
- Skip cleanup on unmount
- Use wrong model for use case

### Do
- Always handle loading and error states
- Provide user feedback
- Implement cleanup
- Select appropriate models
- Use callbacks for side effects
- Reset state when needed

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../AI_GUIDELINES.md)
