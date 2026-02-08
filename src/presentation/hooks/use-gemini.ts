
import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import type { GeminiGenerationConfig } from "../../domain/entities";
import { DEFAULT_MODELS } from "../../domain/entities";
import { geminiTextGenerationService, geminiStructuredTextService } from "../../infrastructure/services";
import { executeWithState } from "../../infrastructure/utils";

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

function cleanJsonResponse(text: string): string {
  return text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
}


export function useGemini(options: UseGeminiOptions = {}): UseGeminiReturn {
  const [result, setResult] = useState<string | null>(null);
  const [jsonResult, setJsonResult] = useState<unknown>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Use a ref to store the abort controller for the current operation
  const abortControllerRef = useRef<AbortController | null>(null);
  const operationIdRef = useRef(0);

  const setters = useMemo(() => ({ setIsGenerating, setError, setResult, setJsonResult }), []);
  const callbacks = useMemo(() => ({ onSuccess: options.onSuccess, onError: options.onError }), [options.onSuccess, options.onError]);
  const model = options.model ?? DEFAULT_MODELS.TEXT;

  const generate = useCallback(async (prompt: string) => {
    // Create new abort controller for this operation
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const currentOpId = ++operationIdRef.current;

    try {
      await executeWithState(
        { current: false }, // We'll use operation ID instead
        setters,
        callbacks,
        async () => {
          // Check if this operation is still the latest one
          if (currentOpId !== operationIdRef.current) {
            throw new Error("Operation cancelled by newer request");
          }
          return geminiTextGenerationService.generateText(model, prompt, options.generationConfig);
        },
        (text) => {
          // Only update if this is still the latest operation
          if (currentOpId === operationIdRef.current) {
            setResult(text);
            options.onSuccess?.(text);
          }
        }
      );
    } finally {
      // Clean up abort controller if this was the latest operation
      if (currentOpId === operationIdRef.current) {
        abortControllerRef.current = null;
      }
    }
  }, [model, options.generationConfig, setters, callbacks, options.onSuccess]);

  const generateJSON = useCallback(async <T>(prompt: string, schema?: Record<string, unknown>): Promise<T | null> => {
    // Create new abort controller for this operation
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const currentOpId = ++operationIdRef.current;

    try {
      return await executeWithState(
        { current: false }, // We'll use operation ID instead
        setters,
        callbacks,
        async () => {
          // Check if this operation is still the latest one
          if (currentOpId !== operationIdRef.current) {
            throw new Error("Operation cancelled by newer request");
          }

          if (schema) {
            return geminiStructuredTextService.generateStructuredText<T>(model, prompt, schema, options.generationConfig);
          }

          const text = await geminiTextGenerationService.generateText(model, prompt, { ...options.generationConfig, responseMimeType: "application/json" });
          const cleanedText = cleanJsonResponse(text);

          try {
            return JSON.parse(cleanedText) as T;
          } catch (parseError) {
            throw new Error(`Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : String(parseError)}. Response: ${cleanedText.substring(0, 200)}...`);
          }
        },
        (parsed) => {
          // Only update if this is still the latest operation
          if (currentOpId === operationIdRef.current) {
            setJsonResult(parsed);
            setResult(JSON.stringify(parsed, null, 2));
            options.onSuccess?.(JSON.stringify(parsed));
          }
        }
      );
    } finally {
      // Clean up abort controller if this was the latest operation
      if (currentOpId === operationIdRef.current) {
        abortControllerRef.current = null;
      }
    }
  }, [model, options.generationConfig, setters, callbacks, options.onSuccess]);


  const reset = useCallback(() => {
    // Abort any ongoing operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    // Increment operation ID to cancel any pending operations
    operationIdRef.current++;

    setResult(null);
    setJsonResult(null);
    setIsGenerating(false);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      operationIdRef.current++;
    };
  }, []);

  return { generate, generateJSON, result, jsonResult, isGenerating, error, reset };
}
