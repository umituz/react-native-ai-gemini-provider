
export interface TelemetryEvent {
  type: "request" | "response" | "error" | "retry";
  timestamp: number;
  model?: string;
  feature?: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

export type TelemetryListener = (event: TelemetryEvent) => void;

class TelemetryHooks {
  private listeners: TelemetryListener[] = [];
  private failedListeners: Set<TelemetryListener> = new Set();
  private readonly MAX_FAILURES = 3;
  private listenerFailureCounts = new Map<TelemetryListener, number>();

  /**
   * Register a telemetry listener
   */
  subscribe(listener: TelemetryListener): () => void {
    this.listeners.push(listener);
    // Remove from failed listeners on new subscription (in case it's being re-added)
    this.failedListeners.delete(listener);
    this.listenerFailureCounts.set(listener, 0);

    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
      // Clean up failure tracking when listener is removed
      this.failedListeners.delete(listener);
      this.listenerFailureCounts.delete(listener);
    };
  }

  /**
   * Emit a telemetry event to all listeners
   */
  emit(event: TelemetryEvent): void {
    for (const listener of this.listeners) {
      // Skip listeners that have failed too many times
      if (this.failedListeners.has(listener)) {
        continue;
      }

      try {
        listener(event);
        // Reset failure count and remove from failed listeners on success
        const previousFailures = this.listenerFailureCounts.get(listener) || 0;
        if (previousFailures > 0) {
          this.listenerFailureCounts.set(listener, 0);
          this.failedListeners.delete(listener);
        }
      } catch (error) {
        // Track failures
        const failureCount = (this.listenerFailureCounts.get(listener) || 0) + 1;
        this.listenerFailureCounts.set(listener, failureCount);

        // If listener fails too many times, blacklist it
        if (failureCount >= this.MAX_FAILURES) {
          this.failedListeners.add(listener);
        }
      }
    }
  }

  /**
   * Log request start
   */
  logRequest(model: string, feature?: string): number {
    const timestamp = Date.now();
    this.emit({
      type: "request",
      timestamp,
      model,
      feature,
    });
    return timestamp;
  }

  /**
   * Log response received
   */
  logResponse(model: string, startTime: number, feature?: string, metadata?: Record<string, unknown>): void {
    this.emit({
      type: "response",
      timestamp: Date.now(),
      model,
      feature,
      duration: Date.now() - startTime,
      metadata,
    });
  }

  /**
   * Log error
   */
  logError(model: string, error: Error, feature?: string): void {
    this.emit({
      type: "error",
      timestamp: Date.now(),
      model,
      feature,
      metadata: {
        error: error.message,
        errorType: error.name,
      },
    });
  }

  /**
   * Log retry attempt
   */
  logRetry(model: string, attempt: number, feature?: string): void {
    this.emit({
      type: "retry",
      timestamp: Date.now(),
      model,
      feature,
      metadata: { attempt },
    });
  }

  /**
   * Remove a specific listener
   */
  unsubscribe(listener: TelemetryListener): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
    // Clean up failure tracking
    this.failedListeners.delete(listener);
    this.listenerFailureCounts.delete(listener);
  }

  /**
   * Reset failure counts for all listeners (clear blacklist)
   */
  resetFailures(): void {
    this.failedListeners.clear();
    for (const listener of this.listeners) {
      this.listenerFailureCounts.set(listener, 0);
    }
  }

  /**
   * Clear all listeners
   */
  clear(): void {
    this.listeners = [];
    this.failedListeners.clear();
    this.listenerFailureCounts.clear();
  }

  /**
   * Get current listener count
   */
  getListenerCount(): number {
    return this.listeners.length;
  }
}

export const telemetryHooks = new TelemetryHooks();
