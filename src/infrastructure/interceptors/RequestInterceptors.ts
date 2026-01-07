/**
 * Request Interceptors
 * Allows applications to modify requests before they're sent
 */

export interface RequestContext {
  model: string;
  feature?: string;
  payload: Record<string, unknown>;
  timestamp: number;
}

export type RequestInterceptor = (context: RequestContext) => RequestContext | Promise<RequestContext>;

class RequestInterceptors {
  private interceptors: RequestInterceptor[] = [];

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
   * Apply all interceptors to a request context
   */
  async apply(context: RequestContext): Promise<RequestContext> {
    let result = context;

    for (const interceptor of this.interceptors) {
      try {
        result = await interceptor(result);
      } catch (error) {
        // Interceptor error should fail the request
        throw new Error(`Request interceptor failed: ${error instanceof Error ? error.message : String(error)}`);
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
