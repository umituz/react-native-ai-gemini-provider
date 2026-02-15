import { BaseInterceptor, type BaseContext } from "./BaseInterceptor";

export interface RequestContext extends BaseContext {
  payload: Record<string, unknown>;
}

export type RequestInterceptor = (context: RequestContext) => RequestContext | Promise<RequestContext>;

class RequestInterceptors extends BaseInterceptor<RequestContext> {
  /**
   * Apply all interceptors to a request context
   * Interceptors are called in order (first registered = first called)
   */
  async apply(context: RequestContext): Promise<RequestContext> {
    let result = context;

    for (const interceptor of this.interceptors) {
      try {
        result = await interceptor(result);
      } catch (error) {
        this.handleError(context, error);
        // If we get here, strategy was "skip" or "log" - continue with previous result
      }
    }

    return result;
  }
}

export const requestInterceptors = new RequestInterceptors();
