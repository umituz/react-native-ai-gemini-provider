/**
 * Async State Utility
 * Common async execution pattern with state management
 */

export interface AsyncStateCallbacks {
  onSuccess?: (result: string) => void;
  onError?: (error: string) => void;
}

export interface AsyncStateSetters {
  setIsGenerating: (value: boolean) => void;
  setError: (value: string | null) => void;
  setResult: (value: string | null) => void;
  setJsonResult: (value: unknown) => void;
}

/**
 * Execute an async operation with common state management
 */
export async function executeWithState<T>(
  abortRef: React.MutableRefObject<boolean>,
  setters: AsyncStateSetters,
  callbacks: AsyncStateCallbacks,
  execute: () => Promise<T>,
  onResult: (result: T) => void,
): Promise<T | null> {
  abortRef.current = false;
  setters.setIsGenerating(true);
  setters.setError(null);
  setters.setResult(null);
  setters.setJsonResult(null);

  try {
    const result = await execute();
    if (abortRef.current) return null;

    onResult(result);
    return result;
  } catch (err) {
    if (abortRef.current) return null;

    const errorMessage = err instanceof Error ? err.message : "Generation failed";
    setters.setError(errorMessage);
    callbacks.onError?.(errorMessage);
    return null;
  } finally {
    if (!abortRef.current) {
      setters.setIsGenerating(false);
    }
  }
}
