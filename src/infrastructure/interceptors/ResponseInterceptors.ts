import { BaseInterceptor, type BaseContext } from "./BaseInterceptor";

export interface ResponseContext<T = unknown> extends BaseContext {
  data: T;
  duration: number;
}

export type ResponseInterceptor<T = unknown> = (
  context: ResponseContext<T>,
) => ResponseContext<T> | Promise<ResponseContext<T>>;

class ResponseInterceptors extends BaseInterceptor<ResponseContext<unknown>> {
  /**
   * Apply all interceptors to a response context
   * Interceptors are called in reverse order (last registered = first called)
   */
  async apply<T>(context: ResponseContext<T>): Promise<ResponseContext<T>> {
    let result: ResponseContext<unknown> = context;

    // Apply in reverse order (last added = first processed)
    for (let i = this.interceptors.length - 1; i >= 0; i--) {
      const interceptor = this.interceptors[i];
      try {
        result = await interceptor(result);
      } catch (error) {
        this.handleError(context, error);
        // If we get here, strategy was "skip" or "log" - continue with previous result
      }
    }

    return result as ResponseContext<T>;
  }
}

export const responseInterceptors = new ResponseInterceptors();
