/**
 * Content Mapper Utilities
 * Handles transformation between domain content and SDK format
 */

import type {
  GeminiContent,
  GeminiPart,
  GeminiFinishReason,
  GeminiSafetyRating,
  GeminiResponse,
} from "../../domain/entities";

/**
 * Convert domain content to SDK format
 */
export function toSdkContent(contents: GeminiContent[]): Array<{
  role: string;
  parts: Array<{ text: string }>;
}> {
  return contents.map((content) => ({
    role: content.role || "user",
    parts: content.parts.map((part) => ({ text: part.text })),
  }));
}

/**
 * Create a simple text content
 */
export function createTextContent(
  text: string,
  role: "user" | "model" = "user"
): GeminiContent {
  return {
    parts: [{ text }],
    role,
  };
}

/**
 * Transform SDK candidate to domain format
 */
export function transformCandidate(
  candidate: {
    content: { parts: Array<{ text?: string }>; role?: string };
    finishReason?: string;
    safetyRatings?: Array<{
      category: string;
      probability: string;
    }>;
  }
): {
  content: GeminiContent;
  finishReason?: GeminiFinishReason;
  safetyRatings?: GeminiSafetyRating[];
} {
  const transformedParts: GeminiPart[] = [];

  for (const part of candidate.content.parts) {
    if ("text" in part && typeof part.text === "string") {
      transformedParts.push({ text: part.text });
    }
  }

  const finishReason: GeminiFinishReason | undefined = candidate.finishReason
    ? (candidate.finishReason as GeminiFinishReason)
    : undefined;

  const safetyRatings: GeminiSafetyRating[] | undefined = candidate.safetyRatings
    ? candidate.safetyRatings.map((rating) => ({
        category: rating.category as GeminiSafetyRating["category"],
        probability: rating.probability as GeminiSafetyRating["probability"],
      }))
    : undefined;

  return {
    content: {
      parts: transformedParts,
      role: (candidate.content.role || "model") as "user" | "model",
    },
    finishReason,
    safetyRatings,
  };
}

/**
 * Transform SDK response to domain format
 */
export function transformResponse(
  response: {
    candidates?: Array<{
      content: { parts: Array<{ text?: string }>; role?: string };
      finishReason?: string;
      safetyRatings?: Array<{
        category: string;
        probability: string;
      }>;
    }>;
    usageMetadata?: {
      promptTokenCount?: number;
      candidatesTokenCount?: number;
      totalTokenCount?: number;
    };
  }
): GeminiResponse {
  return {
    candidates: response.candidates?.map(transformCandidate),
    usageMetadata: response.usageMetadata ? {
      promptTokenCount: response.usageMetadata.promptTokenCount,
      candidatesTokenCount: response.usageMetadata.candidatesTokenCount,
      totalTokenCount: response.usageMetadata.totalTokenCount,
    } : undefined,
  };
}

/**
 * Extract text from content parts
 */
export function extractTextFromParts(parts: GeminiPart[]): string {
  return parts
    .map((part) => ("text" in part ? (part.text || "") : ""))
    .join("");
}
