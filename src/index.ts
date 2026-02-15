/**
 * @umituz/react-native-ai-gemini-provider
 * Google Gemini AI provider for React Native applications
 */

// Domain Types
export type {
  GeminiConfig,
  GeminiGenerationConfig,
  GeminiHarmCategory,
  GeminiHarmBlockThreshold,
  GeminiContent,
  GeminiPart,
  GeminiResponse,
  GeminiCandidate,
  GeminiFinishReason,
  GeminiSafetyRating,
  GeminiUsageMetadata,
  GeminiErrorInfo,
  GeminiApiError,
} from "./domain/entities";

export {
  GeminiErrorType,
  GeminiError,
  GEMINI_MODELS,
  DEFAULT_MODELS
} from "./domain/entities";

// Main Service
export {
  geminiProviderService,
  GeminiProvider,
} from "./infrastructure/services";

export type { GeminiProviderConfig } from "./infrastructure/services";

// React Hook
export { useGemini } from "./presentation/hooks";
export type { UseGeminiOptions, UseGeminiReturn } from "./presentation/hooks";

// Provider Configuration & Factory
export { ConfigBuilder, providerFactory } from "./providers";
export type {
  ProviderConfig,
  ProviderFactoryOptions,
} from "./providers";
