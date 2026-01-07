/**
 * Performance Utilities
 * Tools for measuring and optimizing performance
 */

declare const __DEV__: boolean;

export interface PerformanceMetrics {
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export class PerformanceTimer {
  private startTime: number;
  private endTime?: number;
  private metadata?: Record<string, unknown>;

  constructor(metadata?: Record<string, unknown>) {
    this.startTime = Date.now();
    this.metadata = metadata;
  }

  stop(): number {
    this.endTime = Date.now();
    return this.duration;
  }

  get duration(): number {
    const end = this.endTime ?? Date.now();
    return end - this.startTime;
  }

  getMetrics(): PerformanceMetrics {
    return { duration: this.duration, timestamp: this.startTime, metadata: this.metadata };
  }

  get isRunning(): boolean {
    return this.endTime === undefined;
  }
}

export async function measureAsync<T>(
  operation: () => Promise<T>,
  metadata?: Record<string, unknown>,
): Promise<{ result: T; duration: number }> {
  const timer = new PerformanceTimer(metadata);
  try {
    const result = await operation();
    const duration = timer.stop();
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[Performance] Operation completed:", { duration: `${duration}ms`, metadata });
    }
    return { result, duration };
  } catch (error) {
    timer.stop();
    throw error;
  }
}

export function measureSync<T>(
  operation: () => T,
  metadata?: Record<string, unknown>,
): { result: T; duration: number } {
  const timer = new PerformanceTimer(metadata);
  try {
    const result = operation();
    const duration = timer.stop();
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[Performance] Operation completed:", { duration: `${duration}ms`, metadata });
    }
    return { result, duration };
  } catch (error) {
    timer.stop();
    throw error;
  }
}

export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: never[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export class PerformanceTracker {
  private metrics = new Map<string, number[]>();

  record(operation: string, duration: number): void {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation)!.push(duration);
  }

  getStats(operation: string): { count: number; avg: number; min: number; max: number } | null {
    const durations = this.metrics.get(operation);
    if (!durations || durations.length === 0) return null;
    return {
      count: durations.length,
      avg: durations.reduce((a, b) => a + b, 0) / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
    };
  }

  getAllStats(): Record<string, ReturnType<PerformanceTracker["getStats"]>> {
    const stats: Record<string, ReturnType<PerformanceTracker["getStats"]>> = {};
    for (const operation of this.metrics.keys()) {
      stats[operation] = this.getStats(operation);
    }
    return stats;
  }

  clear(): void {
    this.metrics.clear();
  }
}

export const performanceTracker = new PerformanceTracker();

