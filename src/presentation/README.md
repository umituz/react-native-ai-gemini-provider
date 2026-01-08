# Presentation Layer

Bridge between UI layer and service layer. Contains React components and hooks for UI integration.

## 📍 Import Path

```
import { useGemini } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use presentation layer to integrate AI functionality into React Native UI. Provides React hooks and state management.

**When to use:**
- Add AI features to React Native components
- Manage AI operation state in UI
- Handle loading and error states
- Create AI-powered user interfaces
- Build chat interfaces and forms

## 📌 Strategy

Presentation layer abstracts service complexity. This layer:
- Provides React hooks for AI operations
- Manages loading, error, and result states
- Handles component lifecycle
- Simplifies UI integration
- Enables reactive AI interactions

**Key Decision**: Use hooks for React Native UI components. They provide clean, declarative integration with AI services.

## ⚠️ Rules

### Usage Rules
- **MUST** initialize provider before using hooks
- **SHOULD** use hooks only in React components
- **MUST** handle loading and error states
- **SHOULD** implement cleanup on unmount
- **MUST NOT** use hooks outside React functions

### State Management Rules
- **SHOULD** display loading indicators
- **MUST** handle and display errors
- **SHOULD** implement success callbacks
- **MUST** reset state when appropriate
- **SHOULD NOT** ignore state changes

### UI Integration Rules
- **MUST** provide user feedback during operations
- **SHOULD** disable controls during loading
- **MUST** handle all error states gracefully
- **SHOULD** update UI progressively
- **MUST NOT** block UI thread

### Performance Rules
- **SHOULD** implement cleanup on unmount
- **MUST** cancel operations on unmount
- **SHOULD** use memoization where appropriate
- **MUST NOT** create memory leaks
- **SHOULD** optimize re-renders

## 🤖 AI Agent Guidelines

### When Modifying Presentation Layer
1. **READ** existing hooks first
2. **UNDERSTAND** React patterns
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new functionality
5. **UPDATE** documentation

### When Adding New Hooks
1. **CHECK** if similar hook exists
2. **FOLLOW** existing hook patterns
3. **USE** established state management
4. **DOCUMENT** in hook documentation
5. **ADD** examples to tests (not docs)

### When Creating Components
1. **FOLLOW** React best practices
2. **USE** hooks for state management
3. **HANDLE** all edge cases
4. **PROVIDE** TypeScript types
5. **TEST** component behavior

### Code Style Rules
- **FOLLOW** React hooks rules
- **USE** useMemo/useCallback for optimization
- **VALIDATE** props
- **HANDLE** errors gracefully
- **COMMENT** complex logic only

## 📦 Available Modules

### React Hooks

**useGemini**: Main hook for AI text generation

**Refer to**: [`hooks/README.md`](./hooks/README.md)

**Files:**
- [`hooks/use-gemini.ts`](./hooks/use-gemini.ts) - Hook implementation
- [`hooks/USE_GEMINI_HOOK.md`](./hooks/USE_GEMINI_HOOK.md) - Detailed documentation

## 🔗 Related Modules

- **Services**: [`../infrastructure/services/README.md`](../infrastructure/services/README.md)
- **Domain Types**: [`../domain/README.md`](../domain/README.md)
- **Providers**: [`../providers/README.md`](../providers/README.md)

## 📋 Hook Features

### State Management
- `result`: Generated content
- `isGenerating`: Loading state
- `error`: Error message
- `reset`: Clear all state

### Methods
- `generate(prompt)`: Generate text from prompt
- `generateWithImage(prompt, image, mimeType)`: Generate with image context
- `reset()`: Clear all state

### Configuration
- `model`: Model ID to use
- `generationConfig`: Generation parameters
- `onSuccess`: Success callback
- `onError`: Error callback

## 🎓 Usage Patterns

### Basic Integration
1. Import hook in component
2. Call `useGemini()` hook
3. Use returned methods and state
4. Display loading, error, and result states
5. Handle user interactions

### Chat Interface
1. Use hook for AI responses
2. Maintain messages array in state
3. Call `generate()` on user input
4. Update messages with result
5. Display conversation

### Form Integration
1. Integrate hook with form
2. Call generation on form submit
3. Disable form during generation
4. Display errors appropriately
5. Handle success/failure

### Image Analysis
1. Use `generateWithImage()` method
2. Provide base64 image data
3. Handle loading and result states
4. Display analysis result
5. Handle errors

### State Resetting
1. Use `reset()` to clear state
2. Implement cleanup on unmount
3. Reset before new operations
4. Clear previous results
5. Handle user actions

## 🚨 Common Pitfalls

### Don't
- Use hooks outside React functions
- Forget to handle loading states
- Ignore error states
- Skip cleanup on unmount
- Block UI during operations

### Do
- Always handle loading and error states
- Provide user feedback
- Implement cleanup
- Disable controls during loading
- Reset state appropriately
- Handle all edge cases

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../AI_GUIDELINES.md)
