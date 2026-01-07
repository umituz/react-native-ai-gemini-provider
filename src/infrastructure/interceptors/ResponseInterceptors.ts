/**
 * Response Interceptors
 * Allows applications to modify responses after they're received
 */

export interface ResponseContext<T = unknown> {
  model: string;
  feature?: string;
  data: T;
  duration: number;
  timestamp: number;
}

export type ResponseInterceptor<T = unknown> = (
  context: ResponseContext<T>,
) => ResponseContext<T> | Promise<ResponseContext<T>>;

class ResponseInterceptors {
  private interceptors: Array<ResponseInterceptor<unknown>> = [];

  /**
   * Register a response interceptor
   * Interceptors are called in reverse order (last registered = first called)
   */
  use<T = unknown>(interceptor: ResponseInterceptor<T>): () => void {
    this.interceptors.push(interceptor as ResponseInterceptor<unknown>);

    // Return unsubscribe function
    return () => {
      const index = this.interceptors.indexOf(interceptor as ResponseInterceptor<unknown>);
      if (index > -1) {
        this.interceptors.splice(index, 1);
      }
    };
  }

  /**
   * Apply all interceptors to a response context
   */
  async apply<T>(context: ResponseContext<T>): Promise<ResponseContext<T>> {
    let result: ResponseContext<unknown> = context;

    // Apply in reverse order (last added = first processed)
    for (let i = this.interceptors.length - 1; i >= 0; i--) {
      const interceptor = this.interceptors[i];
      try {
        result = await interceptor(result);
      } catch (error) {
        // Interceptor error should fail the response processing
        throw new Error(`Response interceptor failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return result as ResponseContext<T>;
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

export const responseInterceptors = new ResponseInterceptors();
