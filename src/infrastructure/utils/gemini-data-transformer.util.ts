/**
 * Gemini Data Transformer Utility
 * Handles data extraction and response parsing
 */

import type { GeminiResponse } from "../../domain/entities";


/**
 * Extract text from Gemini response
 */
export function extractTextFromResponse(response: GeminiResponse): string {
  const candidate = response.candidates?.[0];

  if (!candidate) {
    throw new Error("No response candidates");
  }

  if (candidate.finishReason === "SAFETY") {
    throw new Error("Content blocked by safety filters");
  }

  const textPart = candidate.content.parts.find(
    (p): p is { text: string } => "text" in p && typeof p.text === "string",
  );

  if (!textPart) {
    throw new Error("No text in response");
  }

  return textPart.text;
}
