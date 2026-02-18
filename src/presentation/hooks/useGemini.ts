import { useState, useCallback, useMemo } from "react";
import type { GeminiGenerationConfig } from "../../domain/entities";
import { DEFAULT_MODELS } from "../../domain/entities";
import { textGeneration, structuredText } from "../../infrastructure/services";
import { executeWithState, type AsyncStateSetters } from "../../infrastructure/utils/async";
import { parseJsonResponse } from "../../infrastructure/utils/json-parser.util";
import { useOperationManager } from "./useOperationManager";

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

  const { executeOperation, abort } = useOperationManager();

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
      await executeOperation(async (signal, _operationId) => {
        await executeWithState(
          setters,
          callbacks,
          async () => {
            return textGeneration.generateText(
              model,
              prompt,
              options.generationConfig,
              signal
            );
          },
          (text: string) => {
            setResult(text);
            options.onSuccess?.(text);
          }
        );
      });
    },
    [model, options.generationConfig, setters, callbacks, options.onSuccess, executeOperation]
  );

  const generateJSON = useCallback(
    async <T>(prompt: string, schema?: Record<string, unknown>): Promise<T | null> => {
      return executeOperation(async (signal, _operationId) => {
        const jsonSetters: AsyncStateSetters<unknown, unknown> = {
          setIsLoading: setIsGenerating,
          setError,
          setResult: setJsonResult,
          setSecondaryResult: (value) =>
            setResult(typeof value === "string" ? value : JSON.stringify(value)),
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
            if (schema) {
              return structuredText.generateStructuredText<T>(
                model,
                prompt,
                schema,
                options.generationConfig,
                signal
              );
            }

            const text = await textGeneration.generateText(
              model,
              prompt,
              { ...options.generationConfig, responseMimeType: "application/json" },
              signal
            );

            return parseJsonResponse<T>(text);
          },
          (parsed: unknown) => {
            setJsonResult(parsed);
            setResult(JSON.stringify(parsed, null, 2));
          }
        );

        return operationResult as T | null;
      });
    },
    [model, options.generationConfig, callbacks, options.onSuccess, executeOperation]
  );

  const reset = useCallback(() => {
    abort();
    setResult(null);
    setJsonResult(null);
    setIsGenerating(false);
    setError(null);
  }, [abort]);

  return { generate, generateJSON, result, jsonResult, isGenerating, error, reset };
}
