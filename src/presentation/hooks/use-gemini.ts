
import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import type { GeminiGenerationConfig } from "../../domain/entities";
import { DEFAULT_MODELS } from "../../domain/entities";
import { geminiTextGenerationService, geminiStructuredTextService } from "../../infrastructure/services";
import { executeWithState, type AsyncStateSetters } from "../../infrastructure/utils/async";
import { parseJsonResponse } from "../../infrastructure/utils/json-parser.util";

export interface UseGeminiOptions {
  model?: string;
  generationConfig?: GeminiGenerationConfig;
  onSuccess?: (result: string) => void;
  onError?: (error: string) => void;
}

export interface UseGeminiReturn {
  generate: (prompt: string) => Promise<void>;
  generateJSON: <T>(prompt: string, schema?: Record<string, unknown>) => Promise<T | null>;
  result: string | null;
  jsonResult: unknown;
  isGenerating: boolean;
  error: string | null;
  reset: () => void;
}

export function useGemini(options: UseGeminiOptions = {}): UseGeminiReturn {
  const [result, setResult] = useState<string | null>(null);
  const [jsonResult, setJsonResult] = useState<unknown>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const operationIdRef = useRef(0);

  const setters: AsyncStateSetters<string, unknown> = useMemo(
    () => ({
      setIsLoading: setIsGenerating,
      setError,
      setResult,
      setSecondaryResult: setJsonResult,
    }),
    []
  );

  const callbacks = useMemo(
    () => ({ onSuccess: options.onSuccess, onError: options.onError }),
    [options.onSuccess, options.onError]
  );

  const model = options.model ?? DEFAULT_MODELS.TEXT;

  const generate = useCallback(
    async (prompt: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      const currentOpId = ++operationIdRef.current;

      try {
        await executeWithState(
          setters,
          callbacks,
          async () => {
            if (currentOpId !== operationIdRef.current) {
              controller.abort();
              throw new Error("Operation cancelled by newer request");
            }
            return geminiTextGenerationService.generateText(
              model,
              prompt,
              options.generationConfig,
              controller.signal
            );
          },
          (text: string) => {
            if (currentOpId === operationIdRef.current) {
              setResult(text);
              options.onSuccess?.(text);
            }
          }
        );
      } finally {
        if (currentOpId === operationIdRef.current) {
          abortControllerRef.current = null;
        }
      }
    },
    [model, options.generationConfig, setters, callbacks, options.onSuccess]
  );

  const generateJSON = useCallback(
    async <T>(prompt: string, schema?: Record<string, unknown>): Promise<T | null> => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      const currentOpId = ++operationIdRef.current;

      try {
        // Create separate setters for JSON generation with proper types
        const jsonSetters: AsyncStateSetters<unknown, unknown> = {
          setIsLoading: setIsGenerating,
          setError,
          setResult: setJsonResult,
          setSecondaryResult: (value) => setResult(typeof value === "string" ? value : JSON.stringify(value)),
        };

        const jsonCallbacks = {
          onSuccess: options.onSuccess
            ? (result: unknown) => options.onSuccess?.(JSON.stringify(result))
            : undefined,
          onError: options.onError,
        };

        const operationResult = await executeWithState<unknown>(
          jsonSetters,
          jsonCallbacks,
          async () => {
            if (currentOpId !== operationIdRef.current) {
              controller.abort();
              throw new Error("Operation cancelled by newer request");
            }

            if (schema) {
              return geminiStructuredTextService.generateStructuredText<T>(
                model,
                prompt,
                schema,
                options.generationConfig,
                controller.signal
              );
            }

            const text = await geminiTextGenerationService.generateText(
              model,
              prompt,
              { ...options.generationConfig, responseMimeType: "application/json" },
              controller.signal
            );

            return parseJsonResponse<T>(text);
          },
          (parsed: unknown) => {
            if (currentOpId === operationIdRef.current) {
              setJsonResult(parsed);
              setResult(JSON.stringify(parsed, null, 2));
            }
          }
        );

        return operationResult as T | null;
      } finally {
        if (currentOpId === operationIdRef.current) {
          abortControllerRef.current = null;
        }
      }
    },
    [model, options.generationConfig, callbacks, options.onSuccess]
  );

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    operationIdRef.current++;

    setResult(null);
    setJsonResult(null);
    setIsGenerating(false);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      operationIdRef.current++;
    };
  }, []);

  return { generate, generateJSON, result, jsonResult, isGenerating, error, reset };
}
