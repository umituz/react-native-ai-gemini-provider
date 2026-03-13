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
  GeminiInlineDataPart,
  GeminiMessagePart,
  GeminiSafetySetting,
  GeminiModelOptions,
  GeminiChatConfig,
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
export {
  createChatSession,
  sendChatMessage,
  buildChatHistory,
  trimChatHistory,
  type ChatSendResult,
  type ChatHistoryMessage,
  type SendChatMessageOptions,
} from "./infrastructure/services/ChatSession";
export { textGeneration } from "./infrastructure/services/TextGeneration";
export { structuredText } from "./infrastructure/services/StructuredText";
export { streaming } from "./infrastructure/services/Streaming";

// React Hook
export { useGemini } from "./presentation/hooks/useGemini";
export type { UseGeminiOptions, UseGeminiReturn } from "./presentation/hooks/useGemini";

// Provider Configuration & Factory
export { ConfigBuilder, providerFactory } from "./providers/ProviderFactory";
export type {
  ProviderConfig,
  ProviderFactoryOptions,
} from "./providers/ProviderFactory";
