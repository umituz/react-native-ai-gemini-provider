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
  VideoGenerationInput,
  VideoGenerationResult,
  VideoGenerationProgress,
  VideoGenerationOptions,
  VideoGenerationError,
  VideoAspectRatio,
  VideoResolution,
  VideoOperationStatus,
  VeoOperation,
} from "./domain/entities";

export { GeminiErrorType } from "./domain/entities";

export type {
  GeminiErrorInfo,
  GeminiApiError,
} from "./domain/entities";

export { GeminiError } from "./domain/entities";

// Model Constants
export {
  GEMINI_MODELS,
  DEFAULT_MODELS,
  RESPONSE_MODALITIES,
} from "./domain/entities";

export type { ResponseModality } from "./domain/entities";

// =============================================================================
// DOMAIN LAYER - Feature Models
// =============================================================================

export {
  GEMINI_IMAGE_FEATURE_MODELS,
  GEMINI_VIDEO_FEATURE_MODELS,
  getGeminiImageFeatureModel,
  getGeminiVideoFeatureModel,
  getAllFeatureModels,
} from "./domain/constants";

export type {
  FeatureModelConfig,
} from "./domain/constants";

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
  geminiVideoGenerationService,
  geminiProviderService,
  createGeminiProvider,
  featureModelSelector,
} from "./infrastructure/services";

export type {
  AIProviderConfig,
  GeminiProviderConfig,
  IAIProvider,
  JobSubmission,
  JobStatus,
  SubscribeOptions,
  AIJobStatusType,
  GenerationInput,
  GenerationResult,
  ExecutionOptions,
  RetryOptions,
} from "./infrastructure/services";

// =============================================================================
// INFRASTRUCTURE LAYER - Utils
// =============================================================================

export {
  mapGeminiError,
  isGeminiErrorRetryable,
  categorizeGeminiError,
  createGeminiError,
  // Model validation
  isValidModel,
  validateModel,
  getSafeModel,
  isTextModel,
  isImageModel,
  isImageEditModel,
  isVideoGenerationModel,
  getModelCategory,
  getAllValidModels,
  // Input builders
  buildSingleImageInput,
  buildDualImageInput,
  buildUpscaleInput,
  buildPhotoRestoreInput,
  buildAIHugInput,
  buildAIKissInput,
  buildFaceSwapInput,
  buildAnimeSelfieInput,
  buildRemoveBackgroundInput,
  buildRemoveObjectInput,
  buildReplaceBackgroundInput,
  buildHDTouchUpInput,
  buildVideoFromDualImagesInput,
} from "./infrastructure/utils";

export type {
  UpscaleOptions as GeminiUpscaleOptions,
  PhotoRestoreOptions as GeminiPhotoRestoreOptions,
  FaceSwapOptions as GeminiFaceSwapOptions,
  AnimeSelfieOptions as GeminiAnimeSelfieOptions,
  RemoveBackgroundOptions as GeminiRemoveBackgroundOptions,
  RemoveObjectOptions as GeminiRemoveObjectOptions,
  ReplaceBackgroundOptions as GeminiReplaceBackgroundOptions,
  VideoFromImageOptions as GeminiVideoFromImageOptions,
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
// TELEMETRY - Monitoring and Observability
// =============================================================================

export { telemetryHooks } from "./infrastructure/telemetry";

export type {
  TelemetryEvent,
  TelemetryListener,
} from "./infrastructure/telemetry";

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
