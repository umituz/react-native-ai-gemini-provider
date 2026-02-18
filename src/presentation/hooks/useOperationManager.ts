/**
 * Operation Manager Hook
 * Reusable abort controller and operation ID management
 * Eliminates code duplication in hooks
 */

import { useRef, useCallback, useEffect } from "react";

export interface OperationManager {
  /**
   * Execute an operation with abort support and operation ID tracking
   */
  executeOperation: <T>(
    operation: (signal: AbortSignal, operationId: number) => Promise<T>
  ) => Promise<T>;

  /**
   * Abort current operation
   */
  abort: () => void;

  /**
   * Check if current operation is active
   */
  isOperationActive: (operationId: number) => boolean;
}

/**
 * Hook for managing operations with abort control
 */
export function useOperationManager(): OperationManager {
  const abortControllerRef = useRef<AbortController | null>(null);
  const operationIdRef = useRef(0);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    operationIdRef.current++;
  }, []);

  const isOperationActive = useCallback((operationId: number): boolean => {
    return operationId === operationIdRef.current;
  }, []);

  const executeOperation = useCallback(
    async <T>(
      operation: (signal: AbortSignal, operationId: number) => Promise<T>
    ): Promise<T> => {
      // Abort any existing operation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new controller and increment operation ID
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const currentOpId = ++operationIdRef.current;

      try {
        return await operation(controller.signal, currentOpId);
      } finally {
        // Clean up only if this is still the current operation
        if (currentOpId === operationIdRef.current) {
          abortControllerRef.current = null;
        }
      }
    },
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      operationIdRef.current++;
    };
  }, []);

  return {
    executeOperation,
    abort,
    isOperationActive,
  };
}
