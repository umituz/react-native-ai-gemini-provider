/**
 * Async State Execution Utilities
 * Utilities for managing asynchronous operation state
 */

/**
 * Callbacks for async operation outcomes
 */
export interface AsyncStateCallbacks<T = string> {
  onSuccess?: (result: T) => void;
  onError?: (error: string) => void;
}

/**
 * Setter functions for updating state
 */
export interface AsyncStateSetters<T = string, U = unknown> {
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setResult: (value: T | null) => void;
  setSecondaryResult?: (value: U | null) => void;
}

/**
 * Configuration for executeWithState
 */
export interface AsyncStateConfig<T = string> {
  resetState?: boolean;
  throwOnError?: boolean;
  transformResult?: (result: T) => T;
}

/**
 * Execute an async operation with automatic state management
 *
 * @param setters - State setter functions
 * @param callbacks - Optional callbacks for success/error
 * @param execute - The async operation to execute
 * @param onResult - Function to handle successful result
 * @param config - Optional configuration
 *
 * @returns The result or null if failed/aborted
 *
 * @example
 * ```ts
 * const result = await executeWithState(
 *   { setIsLoading, setError, setResult },
 *   { onSuccess: console.log },
 *   () => apiCall(),
 *   (data) => setResult(data)
 * );
 * ```
 */
export async function executeWithState<T, U = unknown>(
  setters: AsyncStateSetters<T, U>,
  callbacks: AsyncStateCallbacks<T>,
  execute: () => Promise<T>,
  onResult: (result: T) => void,
  config: AsyncStateConfig<T> = {},
): Promise<T | null> {
  const {
    resetState = true,
    throwOnError = false,
    transformResult,
  } = config;

  if (resetState) {
    setters.setError(null);
    setters.setResult(null);
    setters.setSecondaryResult?.(null);
  }

  setters.setIsLoading(true);

  try {
    const result = await execute();

    // Apply transformation if provided
    const finalResult = transformResult ? transformResult(result) : result;

    onResult(finalResult);
    callbacks.onSuccess?.(finalResult);

    return finalResult;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Operation failed";

    setters.setError(errorMessage);
    callbacks.onError?.(errorMessage);

    if (throwOnError) {
      throw err;
    }

    return null;
  } finally {
    setters.setIsLoading(false);
  }
}
