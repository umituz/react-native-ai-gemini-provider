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

// Services
export { geminiClient } from "./infrastructure/services/GeminiClient";
export { textGeneration } from "./infrastructure/services/TextGeneration";
export { structuredText } from "./infrastructure/services/StructuredText";
export { streaming } from "./infrastructure/services/Streaming";
export { geminiProvider, GeminiProvider } from "./infrastructure/services/GeminiProvider";

// React Hook
export { useGemini } from "./presentation/hooks";
export type { UseGeminiOptions, UseGeminiReturn } from "./presentation/hooks";

// Provider Configuration & Factory
export { ConfigBuilder, providerFactory } from "./providers";
export type {
  ProviderConfig,
  ProviderFactoryOptions,
} from "./providers";
