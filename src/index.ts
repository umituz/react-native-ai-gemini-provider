/**
 * @umituz/react-native-ai-gemini-provider
 * Google Gemini AI provider for React Native applications
 *
 * Usage:
 *   import {
 *     geminiClientService,
 *     geminiProviderService,
 *     useGemini,
 *     mapGeminiError,
 *   } from '@umituz/react-native-ai-gemini-provider';
 */

// =============================================================================
// DOMAIN LAYER - Types
// =============================================================================

export type {
  GeminiConfig,
  GeminiGenerationConfig,
  GeminiSafetySettings,
  GeminiHarmCategory,
  GeminiHarmBlockThreshold,
  GeminiContent,
  GeminiPart,
  GeminiRequest,
  GeminiResponse,
  GeminiCandidate,
  GeminiFinishReason,
  GeminiSafetyRating,
  GeminiPromptFeedback,
  GeminiUsageMetadata,
  GeminiModel,
  GeminiImageGenerationResult,
  GeminiImageInput,
} from "./domain/entities";

export { GeminiErrorType } from "./domain/entities";

export type {
  GeminiErrorInfo,
  GeminiApiError,
} from "./domain/entities";

// Model Constants
export {
  GEMINI_MODELS,
  DEFAULT_MODELS,
  RESPONSE_MODALITIES,
} from "./domain/entities";

export type { ResponseModality } from "./domain/entities";

// =============================================================================
// INFRASTRUCTURE LAYER - Services
// =============================================================================

export {
  geminiClientCoreService,
  geminiRetryService,
  geminiTextGenerationService,
  geminiImageGenerationService,
  geminiImageEditService,
  geminiStreamingService,
  geminiProviderService,
  createGeminiProvider,
} from "./infrastructure/services";

export type {
  AIProviderConfig,
  JobSubmission,
  JobStatus,
  SubscribeOptions,
} from "./infrastructure/services";

// =============================================================================
// INFRASTRUCTURE LAYER - Utils
// =============================================================================

export {
  mapGeminiError,
  isGeminiErrorRetryable,
  categorizeGeminiError,
} from "./infrastructure/utils";

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export { useGemini } from "./presentation/hooks";

export type {
  UseGeminiOptions,
  UseGeminiReturn,
} from "./presentation/hooks";

// =============================================================================
// PROVIDER CONFIGURATION - Tier-based Setup
// =============================================================================

export {
  providerFactory,
  resolveProviderConfig,
  getCostOptimizedConfig,
  getQualityOptimizedConfig,
} from "./providers";

export type {
  SubscriptionTier,
  QualityPreference,
  ProviderPreferences,
  ProviderConfigInput,
  ResolvedProviderConfig,
  OptimizationStrategy,
  ProviderFactoryOptions,
} from "./providers";
