/**
 * Gemini Provider Types
 * Configuration and response types for Google Gemini AI
 */

export interface GeminiConfig {
  apiKey: string;
  baseUrl?: string;
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  defaultTimeoutMs?: number;
  /** Model used for text generation (default: gemini-2.5-flash-lite) */
  textModel?: string;
  /** Model used for text-to-image generation (default: imagen-4.0-generate-001) */
  textToImageModel?: string;
  /** Model used for image editing/transformation (default: gemini-2.5-flash-image) */
  imageEditModel?: string;
}

export interface GeminiGenerationConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
  stopSequences?: string[];
  /** Response modalities for multimodal output (TEXT, IMAGE) */
  responseModalities?: Array<"TEXT" | "IMAGE">;
}

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
  | { text: string }
  | { inlineData: { mimeType: string; data: string } }
  | { fileData: { mimeType: string; fileUri: string } };

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

/**
 * Result from image generation
 */
export interface GeminiImageGenerationResult {
  /** Generated text (story, caption, etc.) */
  text?: string;
  /** Data URL of the generated image (data:image/png;base64,...) */
  imageUrl?: string;
  /** Raw base64 image data */
  imageBase64?: string;
  /** MIME type of the generated image */
  mimeType?: string;
}

/**
 * Input for image generation
 */
export interface GeminiImageInput {
  /** Base64 encoded image data (with or without data URL prefix) */
  base64: string;
  /** MIME type (e.g., "image/png", "image/jpeg") */
  mimeType: string;
}
