/**
 * @umituz/react-native-ai-gemini-provider
 * Google Gemini AI provider for React Native applications
 */

// Domain Types
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
  GeminiErrorInfo,
  GeminiApiError,
  ResponseModality,
} from "./domain/entities";

export { GeminiErrorType, GeminiError, GEMINI_MODELS, DEFAULT_MODELS, MODEL_PRICING, RESPONSE_MODALITIES } from "./domain/entities";

// Feature Models
export {
  GEMINI_IMAGE_FEATURE_MODELS,
  GEMINI_VIDEO_FEATURE_MODELS,
  getGeminiImageFeatureModel,
  getGeminiVideoFeatureModel,
  getAllFeatureModels,
} from "./domain/constants";

export type { FeatureModelConfig } from "./domain/constants";

// Services
export {
  geminiClientCoreService,
  geminiRetryService,
  geminiTextGenerationService,
  geminiStructuredTextService,
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

// Utils
export {
  mapGeminiError,
  isGeminiErrorRetryable,
  categorizeGeminiError,
  createGeminiError,
  isValidModel,
  validateModel,
  getSafeModel,
  isTextModel,
  isImageModel,
  isImageEditModel,
  isVideoGenerationModel,
  getModelCategory,
  getAllValidModels,
  measureAsync,
  measureSync,
  debounce,
  throttle,
  PerformanceTimer,
  PerformanceTracker,
  performanceTracker,
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
  PreparedImage,
  UpscaleOptions,
  PhotoRestoreOptions,
  FaceSwapOptions,
  AnimeSelfieOptions,
  RemoveBackgroundOptions,
  RemoveObjectOptions,
  ReplaceBackgroundOptions,
  VideoFromImageOptions,
  PerformanceMetrics,
} from "./infrastructure/utils";

// Hooks
export { useGemini } from "./presentation/hooks";

export type { UseGeminiOptions, UseGeminiReturn } from "./presentation/hooks";

// Telemetry
export { telemetryHooks } from "./infrastructure/telemetry";
export type { TelemetryEvent, TelemetryListener } from "./infrastructure/telemetry";

// Interceptors
export { requestInterceptors, responseInterceptors } from "./infrastructure/interceptors";
export type {
  RequestContext,
  RequestInterceptor,
  ResponseContext,
  ResponseInterceptor,
} from "./infrastructure/interceptors";

// Cache
export { SimpleCache, modelSelectionCache } from "./infrastructure/cache";
export type { CacheOptions } from "./infrastructure/cache";

// Provider Config
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
