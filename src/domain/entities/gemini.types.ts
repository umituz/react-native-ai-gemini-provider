import type { GenerationConfig } from "@google/generative-ai";

/**
 * Configuration for Gemini AI client initialization
 */
export interface GeminiConfig {
  /** API key for authentication */
  apiKey: string;
  /** Optional base URL for API requests */
  baseUrl?: string;
  /** Default timeout in milliseconds */
  defaultTimeoutMs?: number;
  /** Default model to use for text generation */
  textModel?: string;
}

/**
 * Generation configuration for AI requests
 * Extends the SDK's GenerationConfig with proper schema typing
 */
export type GeminiGenerationConfig = Omit<GenerationConfig, "responseSchema"> & {
  responseSchema?: GenerationConfig["responseSchema"];
};

/**
 * Harm categories for content safety filtering
 */
export type GeminiHarmCategory =
  | "HARM_CATEGORY_HARASSMENT"
  | "HARM_CATEGORY_HATE_SPEECH"
  | "HARM_CATEGORY_SEXUALLY_EXPLICIT"
  | "HARM_CATEGORY_DANGEROUS_CONTENT";

/**
 * Threshold levels for blocking harmful content
 */
export type GeminiHarmBlockThreshold =
  | "BLOCK_NONE"
  | "BLOCK_LOW_AND_ABOVE"
  | "BLOCK_MEDIUM_AND_ABOVE"
  | "BLOCK_ONLY_HIGH";

/**
 * Content structure for Gemini API requests
 */
export interface GeminiContent {
  /** Array of content parts (text, images, etc.) */
  parts: GeminiPart[];
  /** Role of the content creator (user or model) */
  role?: "user" | "model";
}

/**
 * Individual content part
 */
export type GeminiPart = { text: string };

/**
 * Response structure from Gemini API
 */
export interface GeminiResponse {
  /** Array of response candidates */
  candidates?: GeminiCandidate[];
  /** Token usage information */
  usageMetadata?: GeminiUsageMetadata;
}

/**
 * Individual response candidate
 */
export interface GeminiCandidate {
  /** Generated content */
  content: GeminiContent;
  /** Reason for generation completion */
  finishReason?: GeminiFinishReason;
  /** Safety ratings for the content */
  safetyRatings?: GeminiSafetyRating[];
}

/**
 * Reasons why generation finished
 */
export type GeminiFinishReason =
  | "FINISH_REASON_UNSPECIFIED"
  | "STOP"
  | "MAX_TOKENS"
  | "SAFETY"
  | "RECITATION"
  | "OTHER";

/**
 * Safety rating for generated content
 */
export interface GeminiSafetyRating {
  /** Category of safety check */
  category: GeminiHarmCategory;
  /** Probability of content being unsafe */
  probability: "NEGLIGIBLE" | "LOW" | "MEDIUM" | "HIGH";
  /** Whether the content was blocked */
  blocked?: boolean;
}

/**
 * Token usage metadata for the request
 */
export interface GeminiUsageMetadata {
  /** Number of tokens in the prompt */
  promptTokenCount?: number;
  /** Number of tokens in the response candidates */
  candidatesTokenCount?: number;
  /** Total number of tokens used */
  totalTokenCount?: number;
}
