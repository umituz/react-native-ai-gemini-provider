/**
 * @umituz/react-native-ai-gemini-provider
 * Google Gemini AI provider for React Native applications
 *
 * Clean DDD Architecture - Production Ready
 *
 * @version 4.0.0
 */

// ============================================================================
// DOMAIN LAYER - Core business logic and types
// ============================================================================

// Domain Entities
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
  DEFAULT_MODELS,
} from "./domain/entities";

// Value Objects
export { ApiKey, ModelName, Timeout } from "./domain/value-objects";

// Domain Services
export { ValidationService, ValidationError } from "./domain/services/validation.service";

// Repository Interfaces
export type {
  ITextGenerationRepository,
  TextGenerationRequest,
} from "./domain/repositories/text-generation.repository";

export type {
  IStreamingRepository,
  StreamingRequest,
} from "./domain/repositories/streaming.repository";

export type {
  IStructuredTextRepository,
  StructuredGenerationRequest,
} from "./domain/repositories/structured-text.repository";

// ============================================================================
// APPLICATION LAYER - Use cases and orchestration
// ============================================================================

// Use Cases
export {
  GenerateTextUseCase,
  StreamContentUseCase,
  GenerateJSONUseCase,
} from "./application/use-cases";

export type {
  GenerateTextOptions,
  GenerateTextResult,
  StreamContentOptions,
  GenerateJSONOptions,
  GenerateJSONResult,
} from "./application/use-cases";

// Builders
export { GeminiConfigBuilder } from "./application/builders";

export type { GeminiConfigOptions } from "./application/builders";

// Providers
export { geminiProvider, GeminiProviderClass } from "./application/providers";

export type { GeminiProvider } from "./application/providers";

// ============================================================================
// INFRASTRUCTURE LAYER - External integrations
// ============================================================================

// Mappers
export {
  ContentMapper,
  ResponseMapper,
  ErrorMapper,
} from "./infrastructure/mappers";

// SDK Adapter
export {
  GeminiSDKAdapter,
  GeminiClient,
  geminiClient,
} from "./infrastructure/external";

// Repository Implementations
export {
  BaseGeminiRepository,
  GeminiTextRepository,
  GeminiStreamingRepository,
  GeminiStructuredTextRepository,
} from "./infrastructure/repositories";

// Utilities
export { parseJsonResponse } from "./infrastructure/utils/json-parser.util";

// ============================================================================
// PRESENTATION LAYER - React hooks and providers
// ============================================================================

// React Hooks
export { useGemini, useOperationManager } from "./presentation/hooks";

export type {
  UseGeminiOptions,
  UseGeminiReturn,
} from "./presentation/hooks";

export type { OperationManager } from "./presentation/hooks/use-operation-manager.hook";

// React Provider Component
export {
  GeminiProviderComponent,
  useGeminiContext,
  useGeminiInitializer,
} from "./presentation/providers";

export type { GeminiProviderProps } from "./presentation/providers";
