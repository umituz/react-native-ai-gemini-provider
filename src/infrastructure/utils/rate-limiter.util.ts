
export interface RateLimiterOptions {
  minInterval?: number; // Minimum milliseconds between requests
  maxQueueSize?: number; // Maximum number of pending requests
}

export class RateLimiter {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;
  private lastRequest = 0;
  private minInterval: number;
  private maxQueueSize: number;

  constructor(options: RateLimiterOptions = {}) {
    this.minInterval = options.minInterval ?? 100; // 100ms minimum interval
    this.maxQueueSize = options.maxQueueSize ?? 100;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.queue.length >= this.maxQueueSize) {
      throw new Error(`Rate limiter queue is full (${this.maxQueueSize} requests pending). Please wait before retrying.`);
    }

    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      // Start queue processing if not already running
      this.processQueue().catch(() => {
        // Individual task errors are handled above, ignore queue processing errors
      });
    });
  }

  private async processQueue(): Promise<void> {
    // Only one processQueue can run at a time
    if (this.processing) {
      return;
    }

    this.processing = true;

    try {
      while (this.queue.length > 0) {
        const elapsed = Date.now() - this.lastRequest;
        if (elapsed < this.minInterval) {
          await new Promise((r) => setTimeout(r, this.minInterval - elapsed));
        }

        const task = this.queue.shift();
        if (task) {
          this.lastRequest = Date.now();
          await task();
        }
      }
    } finally {
      this.processing = false;
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
    this.processing = false;
  }

  reset(): void {
    this.clear();
    this.lastRequest = 0;
  }
}
