/**
 * useGemini Hook
 * React hook for Gemini operations using DDD architecture
 */

import { useState, useCallback, useMemo } from "react";
import type { GeminiGenerationConfig } from "../../domain/entities";
import { DEFAULT_MODELS } from "../../domain/entities";
import { GenerateTextUseCase } from "../../application/use-cases/generate-text.use-case";
import { StreamContentUseCase } from "../../application/use-cases/stream-content.use-case";
import { GenerateJSONUseCase } from "../../application/use-cases/generate-json.use-case";
import { geminiProvider } from "../../application/providers/gemini-provider";
import { useOperationManager } from "./use-operation-manager.hook";

export interface UseGeminiOptions {
  model?: string;
  generationConfig?: GeminiGenerationConfig;
  onSuccess?: (result: string) => void;
  onError?: (error: string) => void;
}

export interface UseGeminiReturn {
  // Text generation
  generate: (prompt: string) => Promise<void>;
  // JSON generation
  generateJSON: <T>(prompt: string, schema: Record<string, unknown>) => Promise<T | null>;
  // Streaming
  stream: (prompt: string, onChunk: (text: string) => void) => Promise<void>;
  // State
  result: string | null;
  jsonResult: unknown;
  isGenerating: boolean;
  error: string | null;
  // Actions
  reset: () => void;
  abort: () => void;
}

export function useGemini(options: UseGeminiOptions = {}): UseGeminiReturn {
  const [result, setResult] = useState<string | null>(null);
  const [jsonResult, setJsonResult] = useState<unknown>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { executeOperation, abort } = useOperationManager();

  const model = options.model ?? DEFAULT_MODELS.TEXT;

  // Generate text
  const generate = useCallback(
    async (prompt: string) => {
      setIsGenerating(true);
      setError(null);
      setResult(null);

      try {
        const useCase = new GenerateTextUseCase(
          geminiProvider.getTextRepository(),
          geminiProvider.getValidator(),
          geminiProvider.getContentMapper()
        );

        const text = await executeOperation(async (signal) => {
          return useCase.executeSimple({
            model,
            prompt,
            config: options.generationConfig,
            signal,
          });
        });

        setResult(text);
        options.onSuccess?.(text);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Generation failed";
        setError(errorMessage);
        options.onError?.(errorMessage);
      } finally {
        setIsGenerating(false);
      }
    },
    [model, options.generationConfig, options.onSuccess, options.onError, executeOperation]
  );

  // Generate JSON
  const generateJSON = useCallback(
    async <T>(prompt: string, schema: Record<string, unknown>): Promise<T | null> => {
      setIsGenerating(true);
      setError(null);
      setJsonResult(null);

      try {
        const useCase = new GenerateJSONUseCase(
          geminiProvider.getStructuredTextRepository(),
          geminiProvider.getValidator()
        );

        const data = await executeOperation(async (signal) => {
          return useCase.executeSimple<T>({
            model,
            prompt,
            schema,
            config: options.generationConfig,
            signal,
          });
        });

        setJsonResult(data);
        setResult(JSON.stringify(data, null, 2));
        options.onSuccess?.(JSON.stringify(data, null, 2));

        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Generation failed";
        setError(errorMessage);
        options.onError?.(errorMessage);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [model, options.generationConfig, options.onSuccess, options.onError, executeOperation]
  );

  // Stream content
  const stream = useCallback(
    async (prompt: string, onChunk: (text: string) => void) => {
      setIsGenerating(true);
      setError(null);
      setResult(null);

      try {
        const useCase = new StreamContentUseCase(
          geminiProvider.getStreamingRepository(),
          geminiProvider.getValidator(),
          geminiProvider.getContentMapper()
        );

        const text = await executeOperation(async (signal) => {
          return useCase.execute({
            model,
            prompt,
            onChunk,
            config: options.generationConfig,
            signal,
          });
        });

        setResult(text);
        options.onSuccess?.(text);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Streaming failed";
        setError(errorMessage);
        options.onError?.(errorMessage);
      } finally {
        setIsGenerating(false);
      }
    },
    [model, options.generationConfig, options.onSuccess, options.onError, executeOperation]
  );

  const reset = useCallback(() => {
    abort();
    setResult(null);
    setJsonResult(null);
    setIsGenerating(false);
    setError(null);
  }, [abort]);

  return {
    generate,
    generateJSON,
    stream,
    result,
    jsonResult,
    isGenerating,
    error,
    reset,
    abort,
  };
}
