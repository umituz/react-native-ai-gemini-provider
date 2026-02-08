import type { GenerationConfig } from "@google/generative-ai";

export interface GeminiConfig {
  apiKey: string;
  baseUrl?: string;
  defaultTimeoutMs?: number;
  textModel?: string;
}

export type GeminiGenerationConfig = Omit<GenerationConfig, "responseSchema"> & {
  responseSchema?: GenerationConfig["responseSchema"];
};

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

export type GeminiPart = { text: string };

export interface GeminiResponse {
  candidates?: GeminiCandidate[];
  usageMetadata?: GeminiUsageMetadata;
}

export interface GeminiCandidate {
  content: GeminiContent;
  finishReason?: GeminiFinishReason;
  safetyRatings?: GeminiSafetyRating[];
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

export interface GeminiUsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

