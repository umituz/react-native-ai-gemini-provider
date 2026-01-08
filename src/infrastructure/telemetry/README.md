# Telemetry Module

Monitoring and logging system for AI operations. Tracks request, response, error, and retry events for observability and debugging.

## 📍 Import Path

```
import { telemetryHooks } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use telemetry to monitor AI operations in real-time. Provides event-based system for tracking performance, errors, and usage patterns.

**When to use:**
- Monitor API call performance
- Track error rates and types
- Analyze usage patterns
- Debug AI operations
- Send events to analytics services
- Implement custom monitoring
- Track rate limiting
- Generate metrics

## 📌 Strategy

Telemetry provides visibility into AI operations. This system:
- Uses publish-subscribe pattern for events
- Supports multiple listeners simultaneously
- Emits events for all operations
- Provides timing and metadata
- Enables custom monitoring solutions
- Integrates with analytics platforms

**Key Decision**: Subscribe to telemetry events early in application lifecycle. Use events for monitoring, analytics, and debugging without modifying core services.

## ⚠️ Rules

### Usage Rules
- **MUST** subscribe to events before operations
- **SHOULD** unsubscribe when done
- **MUST NOT** emit sensitive data in events
- **SHOULD** aggregate metrics for performance
- **MUST** handle listener errors gracefully

### Event Subscription Rules
- **SHOULD** subscribe at application startup
- **MUST** store unsubscribe function
- **SHOULD** handle all event types
- **MUST NOT** block event emission
- **SHOULD** filter events as needed

### Data Privacy Rules
- **MUST NOT** log API keys in events
- **SHOULD NOT** include user data in metadata
- **MUST** sanitize sensitive information
- **SHOULD** use anonymized IDs
- **MUST** comply with privacy policies

### Performance Rules
- **SHOULD** keep listeners lightweight
- **MUST** avoid expensive operations in listeners
- **SHOULD** batch event processing
- **MUST NOT** block main thread
- **SHOULD** use async operations for heavy processing

## 🤖 AI Agent Guidelines

### When Adding Telemetry
1. **SUBSCRIBE** to telemetry events early
2. **HANDLE** all event types appropriately
3. **AGGREGATE** metrics for analysis
4. **SEND** to monitoring/analytics service
5. **UNSUBSCRIBE** on cleanup

### When Creating Custom Monitoring
1. **DEFINE** metrics to track
2. **CREATE** data structures for aggregation
3. **IMPLEMENT** event filtering
4. **CALCULATE** statistics periodically
5. **EXPORT** metrics for visualization

### When Debugging with Telemetry
1. **ADD** verbose logging for events
2. **TRACK** request/response correlation
3. **MONITOR** error patterns
4. **ANALYZE** performance metrics
5. **IDENTIFY** bottlenecks

### Code Style Rules
- **USE** unsubscribe pattern for cleanup
- **FILTER** events by type or model
- **AGGREGATE** metrics efficiently
- **HANDLE** errors in listeners
- **LOG** important state changes

## 📦 Available Telemetry

### TelemetryHooks

**Refer to**: [`TelemetryHooks.ts`](./TelemetryHooks.ts)

**Singleton instance**: `telemetryHooks`

**Methods:**
- `subscribe(listener)` - Add event listener
- `emit(event)` - Emit custom event
- `logRequest(model, feature?)` - Log request start
- `logResponse(model, startTime, feature?, metadata?)` - Log response
- `logError(model, error, feature?)` - Log error
- `logRetry(model, attempt, feature?)` - Log retry
- `clear()` - Clear all listeners
- `getListenerCount()` - Get active listener count

## 🔗 Related Modules

- **Infrastructure README**: [`../infrastructure/README.md`](../infrastructure/README.md)
- **Services**: [`../services/README.md`](../services/README.md)
- **Interceptors**: [`../interceptors/README.md`](../interceptors/README.md)

## 📋 Event Types

### Request Event
Emitted when operation starts.
- Contains model and feature
- Includes timestamp
- No duration yet

### Response Event
Emitted when operation completes.
- Contains model and feature
- Includes duration in milliseconds
- May include metadata (token count, finish reason)

### Error Event
Emitted when operation fails.
- Contains model and feature
- Includes error information
- May include error type

### Retry Event
Emitted when retry is attempted.
- Contains model and feature
- Includes attempt number
- Tracks retry behavior

## 🎓 Usage Patterns

### Basic Monitoring
1. Import `telemetryHooks`
2. Subscribe to events with listener function
3. Handle different event types
4. Store unsubscribe function
5. Unsubscribe on cleanup

### Analytics Integration
1. Subscribe to telemetry events
2. Transform events to analytics format
3. Send to analytics service
4. Filter sensitive information
5. Handle errors gracefully

### Performance Tracking
1. Track response times by model
2. Calculate statistics (avg, min, max)
3. Monitor trends over time
4. Alert on slow operations
5. Generate performance reports

### Error Tracking
1. Subscribe to error events
2. Categorize errors by type
3. Track error rates
4. Send to error tracking service
5. Monitor for anomalies

### Custom Dashboard
1. Aggregate event data
2. Calculate statistics
3. Track model usage
4. Monitor success rates
5. Generate dashboard metrics

## 🚨 Common Pitfalls

### Don't
- Forget to unsubscribe from events
- Log sensitive data in events
- Block event emission with heavy processing
- Subscribe multiple times without cleanup
- Emit custom events without proper format

### Do
- Subscribe early in application lifecycle
- Clean up listeners when done
- Keep listeners lightweight
- Aggregate metrics efficiently
- Handle all event types appropriately

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
