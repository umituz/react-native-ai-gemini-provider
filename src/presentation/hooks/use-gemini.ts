/**
 * useGemini Hook
 * React hook for Gemini AI generation
 * Supports text, structured JSON, and multimodal generation
 */

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
  const abortRef = useRef(false);

  const setters = useMemo(() => ({ setIsGenerating, setError, setResult, setJsonResult }), []);
  const callbacks = useMemo(() => ({ onSuccess: options.onSuccess, onError: options.onError }), [options.onSuccess, options.onError]);
  const model = options.model ?? DEFAULT_MODELS.TEXT;

  const generate = useCallback(async (prompt: string) => {
    await executeWithState(abortRef, setters, callbacks,
      () => geminiTextGenerationService.generateText(model, prompt, options.generationConfig),
      (text) => { setResult(text); options.onSuccess?.(text); }
    );
  }, [model, options.generationConfig, setters, callbacks, options.onSuccess]);

  const generateJSON = useCallback(async <T>(prompt: string, schema?: Record<string, unknown>): Promise<T | null> => {
    return executeWithState(abortRef, setters, callbacks,
      async () => {
        if (schema) {
          return geminiStructuredTextService.generateStructuredText<T>(model, prompt, schema, options.generationConfig);
        }
        const text = await geminiTextGenerationService.generateText(model, prompt, { ...options.generationConfig, responseMimeType: "application/json" });
        return JSON.parse(cleanJsonResponse(text)) as T;
      },
      (parsed) => {
        setJsonResult(parsed);
        setResult(JSON.stringify(parsed, null, 2));
        options.onSuccess?.(JSON.stringify(parsed));
      }
    );
  }, [model, options.generationConfig, setters, callbacks, options.onSuccess]);


  const reset = useCallback(() => {
    abortRef.current = true;
    setResult(null);
    setJsonResult(null);
    setIsGenerating(false);
    setError(null);
  }, []);

  useEffect(() => {
    return () => { abortRef.current = true; };
  }, []);

  return { generate, generateJSON, result, jsonResult, isGenerating, error, reset };
}
