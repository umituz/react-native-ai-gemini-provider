# AI Development Guidelines

**CRITICAL**: This document contains MANDATORY rules, strategies, and restrictions for all AI agents and developers working on this codebase.

## 🚫 RESTRICTED ACTIONS (FORBIDDEN)

### Documentation Rules
- **NEVER** include code examples in documentation
- **NEVER** copy-paste implementation details into docs
- **NEVER** hardcode configuration values in documentation
- **NEVER** assume file structure remains static
- **NEVER** create tutorials in documentation

### Code Rules
- **NEVER** bypass type safety
- **NEVER** ignore error handling
- **NEVER** use hardcoded API keys
- **NEVER** commit sensitive data
- **NEVER** disable ESLint rules without approval

## ✅ REQUIRED ACTIONS (MANDATORY)

### Documentation Requirements
- **ALWAYS** reference files by relative import path
- **ALWAYS** specify which module/service to use
- **ALWAYS** include strategy section
- **ALWAYS** include rules section
- **ALWAYS** include AI agent guidelines

### Code Requirements
- **ALWAYS** use TypeScript strict mode
- **ALWAYS** handle errors appropriately
- **ALWAYS** use environment variables for config
- **ALWAYS** follow existing patterns
- **ALWAYS** write tests for new features

## 📋 DOCUMENTATION STRUCTURE

Every documentation file MUST follow this structure:

```markdown
# [Feature/Module Name]

[brief description]

## 📍 Import Path

```
import { [ExportName] } from '[relative-path]';
```

## 🎯 Purpose

[what this module does and when to use it]

## 📌 Strategy

[strategic decisions and rationale]

## ⚠️ Rules

[mandatory rules for using this module]

## 🤖 AI Agent Guidelines

[specific instructions for AI agents]

## 🔗 Related Modules

[list of related modules with their paths]
```

## 🎯 STRATEGY PRINCIPLES

### 1. Reference Over Repetition
- **WHY**: Code changes frequently, documentation doesn't
- **HOW**: Reference implementation by import path
- **RESULT**: Documentation stays accurate automatically

### 2. Type Safety First
- **WHY**: Prevents runtime errors
- **HOW**: Use TypeScript strict mode
- **RESULT**: Catches errors at compile time

### 3. Fail Gracefully
- **WHY**: AI operations can fail
- **HOW**: Always handle errors appropriately
- **RESULT**: Better user experience

### 4. Configuration Externalization
- **WHY**: Different environments need different settings
- **HOW**: Use environment variables
- **RESULT**: Flexible deployment

### 5. Observability
- **WHY**: Debugging production issues
- **HOW**: Log important operations
- **RESULT**: Faster issue resolution

## 🤖 AI AGENT BEHAVIOR RULES

### When Asked to Write Code
1. **READ** existing files first
2. **FOLLOW** established patterns
3. **ASK** if pattern is unclear
4. **NEVER** create new patterns without discussion

### When Asked to Document
1. **NEVER** include code examples
2. **ALWAYS** use import paths
3. **INCLUDE** strategy section
4. **INCLUDE** rules section
5. **INCLUDE** AI guidelines section

### When Asked to Refactor
1. **UNDERSTAND** why current code exists
2. **IDENTIFY** all dependencies
3. **PROPOSE** changes first
4. **WAIT** for approval
5. **UPDATE** tests after changes

### When Patterns Are Unclear
1. **SEARCH** for similar implementations
2. **ASK** for clarification
3. **PROPOSE** approach
4. **WAIT** for approval
5. **DOCUMENT** decision

## 📦 MODULE ORGANIZATION

### Domain Layer (`src/domain/`)
- **Purpose**: Core business entities and types
- **Rule**: NO external dependencies
- **Contains**: Interfaces, types, constants

### Infrastructure Layer (`src/infrastructure/`)
- **Purpose**: External service integrations
- **Rule**: Use dependency injection
- **Contains**: Services, utilities, cache, telemetry

### Presentation Layer (`src/presentation/`)
- **Purpose**: React hooks and UI integration
- **Rule**: NO business logic
- **Contains**: Hooks, components

### Providers Layer (`src/providers/`)
- **Purpose**: App configuration and initialization
- **Rule**: Singleton pattern
- **Contains**: Provider setup

## 🔒 SECURITY RULES

### API Keys
- **NEVER** hardcode API keys
- **ALWAYS** use environment variables
- **VALIDATE** keys on initialization
- **ROTATE** keys periodically

### Data Validation
- **ALWAYS** validate user input
- **ALWAYS** sanitize AI responses
- **NEVER** trust client-side data
- **USE** type guards

### Error Messages
- **NEVER** expose internal details
- **ALWAYS** user-friendly messages
- **LOG** technical details separately
- **TRACK** errors for monitoring

## 🧪 TESTING REQUIREMENTS

### Unit Tests
- **REQUIRED** for all utilities
- **REQUIRED** for all services
- **COVER** happy path and edge cases
- **MOCK** external dependencies

### Integration Tests
- **REQUIRED** for critical paths
- **TEST** error scenarios
- **VALIDATE** error handling

### E2E Tests
- **REQUIRED** for user flows
- **TEST** common scenarios
- **VALIDATE** UI interactions

## 📝 CODING STANDARDS

### TypeScript
- Use strict mode
- Explicit return types
- No `any` types
- Type guards for validation

### Naming Conventions
- Files: `kebab-case.ts`
- Components: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

### File Organization
- One export per file
- Barrel exports for directories
- Index files for public API

## 🚀 PERFORMANCE RULES

### Caching
- **USE** cache for expensive operations
- **INVALIDATE** appropriately
- **CONFIGURE** TTL values
- **MONITOR** cache hit rates

### Async Operations
- **USE** async/await
- **AVOID** callback hell
- **HANDLE** errors properly
- **TIMEOUT** long-running operations

### Memory Management
- **CLEANUP** on unmount
- **AVOID** memory leaks
- **USE** weak references where appropriate
- **MONITOR** memory usage

## 🔄 DEPLOYMENT RULES

### Environment Variables
- **DEFINE** all required variables
- **DOCUMENT** in README
- **VALIDATE** on startup
- **PROVIDE** defaults where safe

### Version Management
- **FOLLOW** semantic versioning
- **DOCUMENT** breaking changes
- **MAINTAIN** CHANGELOG
- **TAG** releases

## 📚 DOCUMENTATION RULES

### What to Include
- Import paths
- Purpose and usage
- Strategy and rationale
- Rules and constraints
- AI agent guidelines

### What to Exclude
- Code examples (use file references)
- Implementation details
- Tutorials
- Copy-pasted code

### Format Requirements
- Markdown format
- English language
- Section headers (📍, 🎯, 📌, ⚠️, 🤖, 🔗)
- Consistent structure

## 🎓 LEARNING PATH

For new AI agents working on this codebase:

1. **READ** this document first
2. **EXPLORE** domain layer to understand types
3. **STUDY** infrastructure services
4. **REVIEW** presentation hooks
5. **FOLLOW** patterns when adding code
6. **UPDATE** documentation when adding features

## 🔍 TROUBLESHOOTING

### Common Issues
- **Type errors**: Check type definitions in domain layer
- **Import errors**: Verify file paths and exports
- **Runtime errors**: Check error handling in services
- **Performance issues**: Review cache configuration

### Getting Help
1. Search existing code for patterns
2. Read relevant documentation
3. Ask specific questions
4. Provide context (file paths, error messages)

## 📊 SUCCESS METRICS

### Code Quality
- TypeScript strict mode compliance
- Test coverage > 80%
- No ESLint warnings
- No console.log in production

### Documentation Quality
- All modules documented
- No code examples in docs
- All docs follow structure
- AI agent guidelines included

### Performance
- API response time < 5s
- Cache hit rate > 50%
- Memory leaks = 0
- Error rate < 1%

---

**IMPORTANT**: This is a living document. Update it when:
- New patterns are established
- Rules change
- New constraints are discovered
- Better practices emerge

**Last Updated**: 2025-01-08

**Maintained By**: Development Team
