/**
 * Operation Manager Hook
 * Manages abort controllers and operation tracking
 */

import { useRef, useCallback, useEffect } from "react";

export interface OperationManager {
  executeOperation: <T>(
    operation: (signal: AbortSignal) => Promise<T>
  ) => Promise<T>;
  abort: () => void;
  isOperationActive: () => boolean;
}

export function useOperationManager(): OperationManager {
  const abortControllerRef = useRef<AbortController | null>(null);
  const isActiveRef = useRef(false);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    isActiveRef.current = false;
  }, []);

  const executeOperation = useCallback(
    async <T>(operation: (signal: AbortSignal) => Promise<T>): Promise<T> => {
      // Abort any existing operation
      abort();

      // Create new controller
      const controller = new AbortController();
      abortControllerRef.current = controller;
      isActiveRef.current = true;

      try {
        return await operation(controller.signal);
      } finally {
        // Clean up only if still active
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
          isActiveRef.current = false;
        }
      }
    },
    [abort]
  );

  const isOperationActive = useCallback((): boolean => {
    return isActiveRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  return {
    executeOperation,
    abort,
    isOperationActive,
  };
}
