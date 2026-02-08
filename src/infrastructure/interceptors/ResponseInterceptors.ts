
import type { InterceptorErrorStrategy } from "./RequestInterceptors";
import { telemetryHooks } from "../telemetry";

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
  private errorStrategy: InterceptorErrorStrategy = "fail";

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
   * Set error handling strategy for interceptors
   */
  setErrorStrategy(strategy: InterceptorErrorStrategy): void {
    this.errorStrategy = strategy;
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
        // Log to telemetry
        telemetryHooks.logError(context.model, error instanceof Error ? error : new Error(String(error)), context.feature);

        switch (this.errorStrategy) {
          case "fail":
            throw new Error(`Response interceptor failed: ${error instanceof Error ? error.message : String(error)}`);
          case "skip":
            // Skip this interceptor and continue with previous result
            break;
          case "log":
            // Error already logged, continue with previous result
            break;
        }
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
