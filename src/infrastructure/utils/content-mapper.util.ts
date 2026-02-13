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
  GeminiHarmCategory,
} from "../../domain/entities";

const VALID_FINISH_REASONS: readonly string[] = [
  "FINISH_REASON_UNSPECIFIED",
  "STOP",
  "MAX_TOKENS",
  "SAFETY",
  "RECITATION",
  "OTHER",
] as const;

const VALID_HARM_CATEGORIES: readonly string[] = [
  "HARM_CATEGORY_HARASSMENT",
  "HARM_CATEGORY_HATE_SPEECH",
  "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  "HARM_CATEGORY_DANGEROUS_CONTENT",
] as const;

const VALID_PROBABILITIES: readonly string[] = [
  "NEGLIGIBLE",
  "LOW",
  "MEDIUM",
  "HIGH",
] as const;

function isValidFinishReason(value: string): value is GeminiFinishReason {
  return VALID_FINISH_REASONS.includes(value);
}

function isValidHarmCategory(value: string): value is GeminiHarmCategory {
  return VALID_HARM_CATEGORIES.includes(value);
}

function isValidProbability(value: string): value is GeminiSafetyRating["probability"] {
  return VALID_PROBABILITIES.includes(value);
}

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

  const finishReason: GeminiFinishReason | undefined =
    candidate.finishReason && isValidFinishReason(candidate.finishReason)
      ? candidate.finishReason
      : undefined;

  const safetyRatings: GeminiSafetyRating[] | undefined = candidate.safetyRatings
    ? candidate.safetyRatings
        .filter((rating) => isValidHarmCategory(rating.category) && isValidProbability(rating.probability))
        .map((rating) => ({
          category: rating.category as GeminiHarmCategory,
          probability: rating.probability as GeminiSafetyRating["probability"],
        }))
    : undefined;

  const role = candidate.content.role === "user" || candidate.content.role === "model"
    ? candidate.content.role
    : "model";

  return {
    content: {
      parts: transformedParts,
      role,
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
