/**
 * Response Mapper
 * Transforms SDK responses to domain format
 */

import type {
  GeminiResponse,
  GeminiCandidate,
  GeminiContent,
  GeminiFinishReason,
  GeminiHarmCategory,
  GeminiSafetyRating,
} from "../../domain/entities";

const VALID_FINISH_REASONS = [
  "FINISH_REASON_UNSPECIFIED",
  "STOP",
  "MAX_TOKENS",
  "SAFETY",
  "RECITATION",
  "OTHER",
] as const;

const VALID_HARM_CATEGORIES = [
  "HARM_CATEGORY_HARASSMENT",
  "HARM_CATEGORY_HATE_SPEECH",
  "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  "HARM_CATEGORY_DANGEROUS_CONTENT",
] as const;

const VALID_PROBABILITIES = ["NEGLIGIBLE", "LOW", "MEDIUM", "HIGH"] as const;

export class ResponseMapper {
  /**
   * Convert SDK response to domain format
   */
  toDomain(response: {
    candidates?: Array<{
      content: { parts: Array<{ text?: string }>; role?: string };
      finishReason?: string;
      safetyRatings?: Array<{ category: string; probability: string }>;
    }>;
    usageMetadata?: {
      promptTokenCount?: number;
      candidatesTokenCount?: number;
      totalTokenCount?: number;
    };
  }): GeminiResponse {
    return {
      candidates: response.candidates?.map((c) => this.mapCandidate(c)),
      usageMetadata: response.usageMetadata
        ? {
            promptTokenCount: response.usageMetadata.promptTokenCount,
            candidatesTokenCount: response.usageMetadata.candidatesTokenCount,
            totalTokenCount: response.usageMetadata.totalTokenCount,
          }
        : undefined,
    };
  }

  /**
   * Map a single candidate
   */
  private mapCandidate(
    candidate: {
      content: { parts: Array<{ text?: string }>; role?: string };
      finishReason?: string;
      safetyRatings?: Array<{ category: string; probability: string }>;
    }
  ): GeminiCandidate {
    return {
      content: this.mapCandidateContent(candidate.content),
      finishReason: this.mapFinishReason(candidate.finishReason),
      safetyRatings: this.mapSafetyRatings(candidate.safetyRatings),
    };
  }

  /**
   * Map candidate content
   */
  private mapCandidateContent(content: {
    parts: Array<{ text?: string }>;
    role?: string;
  }): GeminiContent {
    return {
      parts: content.parts
        .filter((p) => p.text)
        .map((p) => ({ text: p.text || "" })),
      role: content.role === "user" || content.role === "model" ? content.role : "model",
    };
  }

  /**
   * Map finish reason with validation
   */
  private mapFinishReason(value: string | undefined): GeminiFinishReason | undefined {
    if (!value) return undefined;
    return VALID_FINISH_REASONS.includes(value as GeminiFinishReason)
      ? (value as GeminiFinishReason)
      : undefined;
  }

  /**
   * Map safety ratings with validation
   */
  private mapSafetyRatings(
    ratings: Array<{ category: string; probability: string }> | undefined
  ): GeminiSafetyRating[] | undefined {
    if (!ratings) return undefined;

    return ratings
      .filter((r) => this.isValidHarmCategory(r.category) && this.isValidProbability(r.probability))
      .map((r) => ({
        category: r.category as GeminiHarmCategory,
        probability: r.probability as GeminiSafetyRating["probability"],
      }));
  }

  /**
   * Validate harm category
   */
  private isValidHarmCategory(value: string): value is GeminiHarmCategory {
    return VALID_HARM_CATEGORIES.includes(value as GeminiHarmCategory);
  }

  /**
   * Validate probability
   */
  private isValidProbability(value: string): value is GeminiSafetyRating["probability"] {
    return VALID_PROBABILITIES.includes(value as GeminiSafetyRating["probability"]);
  }

  /**
   * Extract text from response
   */
  extractText(response: GeminiResponse): string {
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No response candidates");
    }

    const candidate = response.candidates[0];

    // Handle finish reasons
    if (candidate.finishReason === "SAFETY") {
      throw new Error("Content blocked by safety filters");
    }
    if (candidate.finishReason === "RECITATION") {
      throw new Error("Content blocked due to recitation concerns");
    }

    if (!candidate.content?.parts) {
      throw new Error("No content in response candidate");
    }

    const textPart = candidate.content.parts.find(
      (p): p is { text: string } => "text" in p && typeof p.text === "string"
    );

    if (!textPart) {
      throw new Error("No text in response");
    }

    return textPart.text;
  }
}
