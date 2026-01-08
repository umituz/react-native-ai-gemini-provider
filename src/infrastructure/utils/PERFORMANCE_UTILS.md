# Performance Utilities

Tools for measuring, tracking, and optimizing AI operation performance.

## 📍 Import Path

```
import {
  measureAsync,
  measureSync,
  debounce,
  throttle,
  PerformanceTimer,
  performanceTracker
} from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use these utilities to monitor and optimize AI operation performance. Provides timing, debouncing, throttling, and performance tracking.

**When to use:**
- Measure API call duration
- Track performance metrics over time
- Implement debouncing for user input
- Throttle expensive operations
- Monitor slow operations
- Optimize application performance

## 📌 Strategy

Performance monitoring is crucial for UX. These utilities:
- Measure operation duration accurately
- Track metrics over time
- Provide performance statistics
- Enable optimization through debouncing/throttling
- Support performance debugging

**Key Decision**: Use `measureAsync()` for all critical AI operations to identify performance bottlenecks early.

## ⚠️ Rules

### Usage Rules
- **MUST** always stop PerformanceTimers
- **SHOULD** include metadata for context
- **MUST** track slow operations (>5s)
- **SHOULD** clear statistics periodically
- **MUST NOT** leak timers (always cleanup)

### Measurement Rules
- **SHOULD** measure async operations
- **MUST** use descriptive operation names
- **SHOULD** include relevant metadata
- **MUST** handle errors in measured operations
- **SHOULD NOT** measure trivial operations

### Debounce/Throttle Rules
- **SHOULD** debounce user input
- **MUST** throttle expensive operations
- **SHOULD** set appropriate time intervals
- **MUST NOT** debounce/throttle everything
- **SHOULD** consider UX impact

## 🤖 AI Agent Guidelines

### When Modifying These Utilities
1. **READ** the implementation file first
2. **UNDERSTAND** performance implications
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new functionality
5. **UPDATE** type definitions

### When Adding New Features
1. **CHECK** if similar utility exists
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
- **USE** precise timing measurements
- **VALIDATE** inputs
- **HANDLE** errors gracefully
- **LOG** performance in development
- **COMMENT** complex logic only

## 📦 Available Utilities

### `measureAsync(operation, metadata?)`

Measure async operation duration.

**Refer to**: [`performance.util.ts`](./performance.util.ts)

### `measureSync(operation, metadata?)`

Measure sync operation duration.

**Refer to**: [`performance.util.ts`](./performance.util.ts)

### `debounce(func, wait)`

Debounce function calls.

**Refer to**: [`performance.util.ts`](./performance.util.ts)

### `throttle(func, limit)`

Throttle function calls.

**Refer to**: [`performance.util.ts`](./performance.util.ts)

### `PerformanceTimer`

Timer class for measuring operations.

**Refer to**: [`performance.util.ts`](./performance.util.ts)

### `performanceTracker`

Global performance statistics tracker.

**Refer to**: [`performance.util.ts`](./performance.util.ts)

## 🔗 Related Modules

- **Telemetry Service**: [`../services/TELEMETRY_SERVICE.md`](../services/TELEMETRY_SERVICE.md)
- **Retry Service**: [`../services/RETRY_SERVICE.md`](../services/RETRY_SERVICE.md)
- **Domain Types**: [`../../domain/entities/README.md`](../../domain/entities/README.md)

## 📋 Configuration Reference

### Performance Metrics

Tracked metrics include:
- `count`: Number of operations
- `avg`: Average duration (ms)
- `min`: Minimum duration (ms)
- `max`: Maximum duration (ms)

### Debounce/Throttle Timing

**Typical values:**
- User input debounce: 300-500ms
- API call throttle: 1000-2000ms
- Expensive operations: 2000-5000ms

## 🎓 Usage Patterns

### Measuring API Calls
1. Import `measureAsync`
2. Wrap API call in measurement
3. Include descriptive metadata
4. Check duration for slow operations
5. Log or report performance issues

### Performance Monitoring
1. Create `PerformanceTimer` instance
2. Start timer before operation
3. Stop timer after operation (in finally block)
4. Extract metrics from timer
5. Handle results appropriately

### Performance Statistics
1. Record operation with `performanceTracker.record()`
2. Get statistics with `getStats()`
3. Analyze average/min/max durations
4. Identify slow operations
5. Clear stats periodically

### Debouncing User Input
1. Import `debounce` utility
2. Wrap user input handler
3. Set appropriate delay (300-500ms)
4. Handle debounced calls
5. Update UI appropriately

### Throttling API Calls
1. Import `throttle` utility
2. Wrap expensive operation
3. Set minimum time between calls
4. Handle throttled execution
5. Provide user feedback

### Performance Comparison
1. Use `measureAsync` for each operation
2. Compare durations
3. Identify faster/slower methods
4. Optimize based on results
5. Document findings

## 🚨 Common Pitfalls

### Don't
- Forget to stop timers (memory leaks)
- Skip metadata (hard to analyze)
- Ignore slow operations
- Debounce/throttle everything
- Clear statistics too frequently

### Do
- Always stop timers in finally blocks
- Include descriptive metadata
- Monitor for slow operations (>5s)
- Set appropriate debounce/throttle intervals
- Clear stats periodically (daily)
- Consider UX when timing operations

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../AI_GUIDELINES.md)
