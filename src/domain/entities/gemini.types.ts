/**
 * Gemini Provider Types
 * Configuration and response types for Google Gemini AI
 */

import type { GenerationConfig } from "@google/generative-ai";

export interface GeminiConfig {
  apiKey: string;
  baseUrl?: string;
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  defaultTimeoutMs?: number;
  /** Model used for text generation (default: gemini-2.5-flash-lite) */
  textModel?: string;
}

export type GeminiGenerationConfig = Omit<GenerationConfig, "responseSchema"> & {
  /** Response schema for structured JSON output - compatible with Google SDK */
  responseSchema?: GenerationConfig["responseSchema"];
};

export interface GeminiSafetySettings {
  category: GeminiHarmCategory;
  threshold: GeminiHarmBlockThreshold;
}

export type GeminiHarmCategory =
  | "HARM_CATEGORY_HARASSMENT"
  | "HARM_CATEGORY_HATE_SPEECH"
  | "HARM_CATEGORY_SEXUALLY_EXPLICIT"
  | "HARM_CATEGORY_DANGEROUS_CONTENT";

export type GeminiHarmBlockThreshold =
  | "BLOCK_NONE"
  | "BLOCK_LOW_AND_ABOVE"
  | "BLOCK_MEDIUM_AND_ABOVE"
  | "BLOCK_ONLY_HIGH";

export interface GeminiContent {
  parts: GeminiPart[];
  role?: "user" | "model";
}

export type GeminiPart =
  | { text: string };

export interface GeminiRequest {
  contents: GeminiContent[];
  generationConfig?: GeminiGenerationConfig;
  safetySettings?: GeminiSafetySettings[];
}

export interface GeminiResponse {
  candidates?: GeminiCandidate[];
  promptFeedback?: GeminiPromptFeedback;
  usageMetadata?: GeminiUsageMetadata;
}

export interface GeminiCandidate {
  content: GeminiContent;
  finishReason?: GeminiFinishReason;
  safetyRatings?: GeminiSafetyRating[];
  index?: number;
}

export type GeminiFinishReason =
  | "FINISH_REASON_UNSPECIFIED"
  | "STOP"
  | "MAX_TOKENS"
  | "SAFETY"
  | "RECITATION"
  | "OTHER";

export interface GeminiSafetyRating {
  category: GeminiHarmCategory;
  probability: "NEGLIGIBLE" | "LOW" | "MEDIUM" | "HIGH";
  blocked?: boolean;
}

export interface GeminiPromptFeedback {
  blockReason?: "BLOCK_REASON_UNSPECIFIED" | "SAFETY" | "OTHER";
  safetyRatings?: GeminiSafetyRating[];
}

export interface GeminiUsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

export interface GeminiModel {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  inputTokenLimit?: number;
  outputTokenLimit?: number;
  supportedCapabilities?: string[];
}

