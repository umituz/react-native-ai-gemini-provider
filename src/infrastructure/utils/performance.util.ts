
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
    // Use performance.now() for higher precision when available
    this.startTime = typeof performance !== "undefined" && performance.now
      ? performance.now()
      : Date.now();
    this.metadata = metadata;
  }

  stop(): number {
    this.endTime = typeof performance !== "undefined" && performance.now
      ? performance.now()
      : Date.now();
    return this.duration;
  }

  get duration(): number {
    const end = this.endTime ?? (typeof performance !== "undefined" && performance.now
      ? performance.now()
      : Date.now());
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
    timer.stop();
    return { result, duration: timer.duration };
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
    timer.stop();
    return { result, duration: timer.duration };
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
      timeout = undefined;
      func(...args);
    };
    if (timeout) {
      clearTimeout(timeout);
    }
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

