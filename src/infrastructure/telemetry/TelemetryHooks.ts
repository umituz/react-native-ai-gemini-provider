/**
 * Telemetry Hooks
 * Allows applications to monitor and log AI operations
 */

declare const __DEV__: boolean;

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

  /**
   * Register a telemetry listener
   */
  subscribe(listener: TelemetryListener): () => void {
    this.listeners.push(listener);

    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Emit a telemetry event to all listeners
   */
  emit(event: TelemetryEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (error) {
        // Prevent telemetry errors from breaking the app
        if (typeof __DEV__ !== "undefined" && __DEV__) {
          // eslint-disable-next-line no-console
          console.error("[Telemetry] Listener error:", error);
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
   * Clear all listeners
   */
  clear(): void {
    this.listeners = [];
  }

  /**
   * Get current listener count
   */
  getListenerCount(): number {
    return this.listeners.length;
  }
}

export const telemetryHooks = new TelemetryHooks();
