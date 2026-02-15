/**
 * Base Interceptor Class
 * Eliminates code duplication between Request and Response interceptors
 */

import { telemetryHooks } from "../telemetry";

export type InterceptorErrorStrategy = "fail" | "skip" | "log";

export interface BaseContext {
  model: string;
  feature?: string;
  timestamp: number;
}

export abstract class BaseInterceptor<TContext extends BaseContext> {
  protected interceptors: Array<(context: TContext) => TContext | Promise<TContext>> = [];
  protected errorStrategy: InterceptorErrorStrategy = "fail";

  /**
   * Register an interceptor
   */
  use(interceptor: (context: TContext) => TContext | Promise<TContext>): () => void {
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
   * Set error handling strategy
   */
  setErrorStrategy(strategy: InterceptorErrorStrategy): void {
    this.errorStrategy = strategy;
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

  /**
   * Handle interceptor error based on strategy
   */
  protected handleError(context: TContext, error: unknown): void {
    telemetryHooks.logError(
      context.model,
      error instanceof Error ? error : new Error(String(error)),
      context.feature
    );

    if (this.errorStrategy === "fail") {
      throw new Error(
        `Interceptor failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
    // For "skip" and "log", we just continue (error already logged)
  }

  /**
   * Apply interceptors - to be implemented by subclasses
   */
  abstract apply(context: TContext): Promise<TContext>;
}
