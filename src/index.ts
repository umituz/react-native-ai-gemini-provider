/**
 * @umituz/react-native-ai-gemini-provider
 * Google Gemini AI provider for React Native applications
 * Text generation only - for image/video use FAL Provider
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
  GeminiErrorInfo,
  GeminiApiError,
  ResponseModality,
} from "./domain/entities";

export { GeminiErrorType, GeminiError, GEMINI_MODELS, DEFAULT_MODELS, MODEL_PRICING, RESPONSE_MODALITIES } from "./domain/entities";

// Services
export {
  geminiClientCoreService,
  geminiRetryService,
  geminiTextGenerationService,
  geminiTextService,
  geminiStructuredTextService,
  geminiStreamingService,
  geminiProviderService,
  createGeminiProvider,
  GeminiProvider,
} from "./infrastructure/services";

export type {
  GeminiProviderConfig,
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
  measureAsync,
  measureSync,
  debounce,
  throttle,
  PerformanceTimer,
  PerformanceTracker,
  performanceTracker,
  RateLimiter,
  rateLimiter,
} from "./infrastructure/utils";

export type {
  PerformanceMetrics,
  RateLimiterOptions,
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
