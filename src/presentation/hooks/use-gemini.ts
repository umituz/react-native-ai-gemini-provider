/**
 * useGemini Hook
 * React hook for Gemini AI generation
 * Supports text, structured JSON, and multimodal generation
 */

import { useState, useCallback, useRef } from "react";
import type { GeminiGenerationConfig } from "../../domain/entities";
import { DEFAULT_MODELS } from "../../domain/entities";
import { geminiTextGenerationService } from "../../infrastructure/services";
import { geminiStructuredTextService } from "../../infrastructure/services";

export interface UseGeminiOptions {
  /** Model to use (default: gemini-2.5-flash-lite) */
  model?: string;
  /** Generation configuration */
  generationConfig?: GeminiGenerationConfig;
  /** Called on successful generation */
  onSuccess?: (result: string) => void;
  /** Called on error */
  onError?: (error: string) => void;
}

export interface UseGeminiReturn {
  /** Generate text from prompt */
  generate: (prompt: string) => Promise<void>;
  /** Generate text with image input */
  generateWithImage: (
    prompt: string,
    imageBase64: string,
    mimeType: string,
  ) => Promise<void>;
  /** Generate structured JSON response */
  generateJSON: <T>(prompt: string, schema?: Record<string, unknown>) => Promise<T | null>;
  /** Current result */
  result: string | null;
  /** JSON result (when using generateJSON) */
  jsonResult: unknown | null;
  /** Loading state */
  isGenerating: boolean;
  /** Error message */
  error: string | null;
  /** Reset state */
  reset: () => void;
}

export function useGemini(options: UseGeminiOptions = {}): UseGeminiReturn {
  const [result, setResult] = useState<string | null>(null);
  const [jsonResult, setJsonResult] = useState<unknown | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef(false);

  const generate = useCallback(
    async (prompt: string) => {
      abortRef.current = false;
      setIsGenerating(true);
      setError(null);
      setResult(null);
      setJsonResult(null);

      try {
        const model = options.model ?? DEFAULT_MODELS.TEXT;
        const text = await geminiTextGenerationService.generateText(
          model,
          prompt,
          options.generationConfig,
        );

        if (abortRef.current) return;

        setResult(text);
        options.onSuccess?.(text);
      } catch (err) {
        if (abortRef.current) return;

        const errorMessage =
          err instanceof Error ? err.message : "Generation failed";
        setError(errorMessage);
        options.onError?.(errorMessage);
      } finally {
        if (!abortRef.current) {
          setIsGenerating(false);
        }
      }
    },
    [options],
  );

  const generateJSON = useCallback(
    async <T>(prompt: string, schema?: Record<string, unknown>): Promise<T | null> => {
      abortRef.current = false;
      setIsGenerating(true);
      setError(null);
      setResult(null);
      setJsonResult(null);

      try {
        const model = options.model ?? DEFAULT_MODELS.TEXT;

        let parsed: T;

        if (schema) {
          // Use structured text service with schema
          parsed = await geminiStructuredTextService.generateStructuredText<T>(
            model,
            prompt,
            schema,
            options.generationConfig,
          );
        } else {
          // Generate text and parse JSON manually
          const text = await geminiTextGenerationService.generateText(
            model,
            prompt,
            {
              ...options.generationConfig,
              responseMimeType: "application/json",
            },
          );

          // Clean and parse JSON
          const cleanedText = text
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();
          parsed = JSON.parse(cleanedText) as T;
        }

        if (abortRef.current) return null;

        setJsonResult(parsed);
        setResult(JSON.stringify(parsed, null, 2));
        options.onSuccess?.(JSON.stringify(parsed));
        return parsed;
      } catch (err) {
        if (abortRef.current) return null;

        const errorMessage =
          err instanceof Error ? err.message : "JSON generation failed";
        setError(errorMessage);
        options.onError?.(errorMessage);
        return null;
      } finally {
        if (!abortRef.current) {
          setIsGenerating(false);
        }
      }
    },
    [options],
  );

  const generateWithImage = useCallback(
    async (prompt: string, imageBase64: string, mimeType: string) => {
      abortRef.current = false;
      setIsGenerating(true);
      setError(null);
      setResult(null);
      setJsonResult(null);

      try {
        const model = options.model ?? DEFAULT_MODELS.TEXT;
        const response = await geminiTextGenerationService.generateWithImages(
          model,
          prompt,
          [{ base64: imageBase64, mimeType }],
          options.generationConfig,
        );

        if (abortRef.current) return;

        // Extract text from response
        const text =
          response.candidates?.[0]?.content.parts
            .filter((p): p is { text: string } => "text" in p)
            .map((p: { text: string }) => p.text)
            .join("") || "";

        setResult(text);
        options.onSuccess?.(text);
      } catch (err) {
        if (abortRef.current) return;

        const errorMessage =
          err instanceof Error ? err.message : "Generation failed";
        setError(errorMessage);
        options.onError?.(errorMessage);
      } finally {
        if (!abortRef.current) {
          setIsGenerating(false);
        }
      }
    },
    [options],
  );

  const reset = useCallback(() => {
    abortRef.current = true;
    setResult(null);
    setJsonResult(null);
    setIsGenerating(false);
    setError(null);
  }, []);

  return {
    generate,
    generateWithImage,
    generateJSON,
    result,
    jsonResult,
    isGenerating,
    error,
    reset,
  };
}
