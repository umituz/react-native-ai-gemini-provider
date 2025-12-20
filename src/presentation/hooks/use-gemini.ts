/**
 * useGemini Hook
 * React hook for Gemini AI generation
 */

import { useState, useCallback, useRef } from "react";
import type { GeminiGenerationConfig } from "../../domain/entities";
import { geminiTextGenerationService } from "../../infrastructure/services";

export interface UseGeminiOptions {
  model?: string;
  generationConfig?: GeminiGenerationConfig;
  onSuccess?: (result: string) => void;
  onError?: (error: string) => void;
}

export interface UseGeminiReturn {
  generate: (prompt: string) => Promise<void>;
  generateWithImage: (
    prompt: string,
    imageBase64: string,
    mimeType: string,
  ) => Promise<void>;
  result: string | null;
  isGenerating: boolean;
  error: string | null;
  reset: () => void;
}

export function useGemini(options: UseGeminiOptions = {}): UseGeminiReturn {
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef(false);

  const generate = useCallback(
    async (prompt: string) => {
      abortRef.current = false;
      setIsGenerating(true);
      setError(null);
      setResult(null);

      try {
        const model = options.model ?? "gemini-1.5-flash";
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

  const generateWithImage = useCallback(
    async (prompt: string, imageBase64: string, mimeType: string) => {
      abortRef.current = false;
      setIsGenerating(true);
      setError(null);
      setResult(null);

      try {
        const model = options.model ?? "gemini-1.5-flash";
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
    setIsGenerating(false);
    setError(null);
  }, []);

  return {
    generate,
    generateWithImage,
    result,
    isGenerating,
    error,
    reset,
  };
}
