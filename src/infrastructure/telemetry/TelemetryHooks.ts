
export interface TelemetryEvent {
  type: "error";
  timestamp: number;
  model?: string;
  feature?: string;
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
   *
   * @returns Unsubscribe function - IMPORTANT: Call this when done listening to prevent memory leaks
   *
   * @example
   * ```ts
   * const unsubscribe = telemetryHooks.subscribe((event) => console.log(event));
   * // ... later when done
   * unsubscribe(); // Prevents memory leak
   * ```
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
    // Snapshot to prevent mutation during iteration
    const snapshot = [...this.listeners];
    for (const listener of snapshot) {
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
}

export const telemetryHooks = new TelemetryHooks();
