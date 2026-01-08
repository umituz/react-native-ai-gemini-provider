# Structured Text Generation Service

Generates structured JSON output with schema validation. Produces type-safe content with defined structure.

## 📍 Import Path

```
import { geminiStructuredTextService } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use this service to generate AI responses in structured JSON format with type safety and schema validation.

**When to use:**
- Generate JSON with specific structure
- Create type-safe AI responses
- Extract structured data from text
- Build forms and data entry with AI
- Generate configuration objects

## 📌 Strategy

Structured generation ensures type safety and validates output. This service:
- Accepts JSON schema for output validation
- Returns typed responses matching schema
- Validates AI-generated JSON structure
- Provides type-safe interfaces
- Handles parsing and validation errors

**Key Decision**: Use JSON Schema for validation. The service validates AI output against the schema and returns typed results, ensuring data integrity.

## ⚠️ Rules

### Usage Rules
- **MUST** initialize provider with API key before use
- **MUST** provide valid JSON schema
- **SHOULD** define TypeScript interfaces for type safety
- **MUST** handle schema validation errors
- **SHOULD** specify required vs optional fields

### Schema Rules
- **MUST** use valid JSON Schema format
- **SHOULD** include field descriptions
- **MUST** specify required fields explicitly
- **SHOULD** use appropriate types (string, number, boolean, array, object)
- **MUST NOT** create overly complex nested schemas

### Error Handling Rules
- **MUST** catch and handle `GeminiError`
- **MUST** handle PARSING_ERROR for invalid JSON
- **MUST** handle VALIDATION errors for schema mismatches
- **SHOULD** provide fallback values when appropriate
- **MUST NOT** expose API keys in errors

## 🤖 AI Agent Guidelines

### When Modifying This Service
1. **READ** the implementation file first
2. **UNDERSTAND** schema validation logic
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

### `generateStructuredText<T>(model, prompt, schema, config?)`

Generate structured JSON output based on provided schema.

**Refer to**: [`gemini-structured-text.service.ts`](./gemini-structured-text.service.ts)

## 🔗 Related Modules

- **Domain Types**: [`domain/entities/README.md`](../domain/entities/README.md)
- **Text Generation**: [`TEXT_GENERATION_SERVICE.md`](./TEXT_GENERATION_SERVICE.md)
- **Error Utilities**: [`ERROR_UTILITIES.md`](../infrastructure/utils/ERROR_UTILITIES.md)

## 📋 Configuration Reference

### JSON Schema Format

```typescript
{
  type: 'object',
  properties: {
    fieldName: {
      type: 'string' | 'number' | 'boolean' | 'array' | 'object',
      description?: string,
      enum?: string[]
    }
  },
  required: string[]
}
```

### Schema Best Practices
- Use detailed field descriptions
- Specify required fields explicitly
- Use appropriate data types
- Define nested objects clearly
- Add enum constraints for fixed values

## 🎓 Usage Patterns

### Simple JSON Generation
1. Define TypeScript interface for result
2. Create JSON schema matching interface
3. Call `generateStructuredText()` with prompt and schema
4. Receive typed result matching schema
5. Handle validation errors if schema mismatch

### Nested Objects
1. Define nested interfaces
2. Create nested schema structure
3. Specify required fields at each level
4. Generate and validate nested structure
5. Handle result as typed object

### Array Output Schema
1. Define interface with array properties
2. Create schema with array item types
3. Specify array item structure
4. Generate and validate array results
5. Use typed results in application

### Enum Validation
1. Define interface with enum-like fields
2. Create schema with enum constraints
3. Specify allowed values
4. Generate and validate against enum
5. Handle type-safe results

## 🚨 Common Pitfalls

### Don't
- Use minimal schemas without descriptions
- Make all fields required (too strict)
- Use `any` type instead of proper interfaces
- Create overly complex nested schemas
- Ignore validation errors

### Do
- Provide detailed field descriptions
- Explicitly mark required vs optional fields
- Use TypeScript interfaces for type safety
- Test schemas with sample data
- Handle parsing and validation errors
- Use fallback values for non-critical fields

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../AI_GUIDELINES.md)
