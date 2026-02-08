
export interface RequestContext {
  model: string;
  feature?: string;
  payload: Record<string, unknown>;
  timestamp: number;
}

export type RequestInterceptor = (context: RequestContext) => RequestContext | Promise<RequestContext>;

export type InterceptorErrorStrategy = "fail" | "skip" | "log";

class RequestInterceptors {
  private interceptors: RequestInterceptor[] = [];
  private errorStrategy: InterceptorErrorStrategy = "fail";

  /**
   * Register a request interceptor
   * Interceptors are called in order (first registered = first called)
   */
  use(interceptor: RequestInterceptor): () => void {
    this.interceptors.push(interceptor);

    // Return unsubscribe function
    return () => {
      const index = this.interceptors.indexOf(interceptor);
      if (index > -1) {
        this.interceptors.splice(index, 1);
      }
    };
  }

  /**
   * Set error handling strategy for interceptors
   */
  setErrorStrategy(strategy: InterceptorErrorStrategy): void {
    this.errorStrategy = strategy;
  }

  /**
   * Apply all interceptors to a request context
   */
  async apply(context: RequestContext): Promise<RequestContext> {
    let result = context;

    for (const interceptor of this.interceptors) {
      try {
        result = await interceptor(result);
      } catch (error) {
        switch (this.errorStrategy) {
          case "fail":
            throw new Error(`Request interceptor failed: ${error instanceof Error ? error.message : String(error)}`);
          case "skip":
            // Skip this interceptor and continue with previous result
            break;
          case "log":
            // Silently ignore but continue
            break;
        }
      }
    }

    return result;
  }

  /**
   * Clear all interceptors
   */
  clear(): void {
    this.interceptors = [];
  }

  /**
   * Get interceptor count
   */
  count(): number {
    return this.interceptors.length;
  }
}

export const requestInterceptors = new RequestInterceptors();
