/**
 * @umituz/react-native-ai-gemini-provider
 * Google Gemini AI provider for React Native applications
 * Text generation only - for image/video use FAL Provider
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

export { GeminiErrorType, GeminiError, GEMINI_MODELS, DEFAULT_MODELS, MODEL_PRICING } from "./domain/entities";

// Services
export {
  geminiClientCoreService,
  geminiTextGenerationService,
  geminiStructuredTextService,
  geminiStreamingService,
  geminiProviderService,
  GeminiProvider,
} from "./infrastructure/services";

export type { GeminiProviderConfig } from "./infrastructure/services";

// Utils
export {
  // Error handling
  mapGeminiError,
  isGeminiErrorRetryable,
  categorizeGeminiError,
  createGeminiError,
  // Data transformation
  extractTextFromResponse,
  cleanJsonText,
  parseJsonResponse,
  safeParseJson,
  extractJsonFromText,
  toSdkContent,
  createTextContent,
  transformCandidate,
  transformResponse,
  extractTextFromParts,
  // Performance
  measureAsync,
  measureSync,
  debounce,
  throttle,
  PerformanceTimer,
  // Rate limiting
  RateLimiter,
  // Retry logic
  retryWithBackoff,
  retryIf,
  retryWithFixedDelay,
  shouldRetryNetworkError,
  createRetryPredicate,
  // Validation
  validateModelName,
  validateApiKey,
  validateSchema,
  validatePrompt,
  validateTimeout,
  isValidObject,
  validateRequiredFields,
  // Environment
  getRequiredEnv,
  getOptionalEnv,
  getEnvNumber,
  getEnvBoolean,
  loadGeminiEnv,
  getApiKeyFromEnv,
  isDevelopment,
  isDebugEnabled,
  validateEnv,
  getGeminiConfigFromEnv,
  // Async state management
  executeWithState,
  createDebouncedAsync,
  createMemoizedAsync,
} from "./infrastructure/utils";

export type {
  PerformanceMetrics,
  RateLimiterOptions,
  RetryOptions,
  RetryResult,
  EnvConfig,
  AsyncStateCallbacks,
  AsyncStateSetters,
  AsyncStateConfig,
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
  InterceptorErrorStrategy,
} from "./infrastructure/interceptors";

export type {
  ResponseContext,
  ResponseInterceptor,
} from "./infrastructure/interceptors/ResponseInterceptors";

// Provider Config
export {
  providerFactory,
  resolveProviderConfig,
} from "./providers";

export type {
  ProviderPreferences,
  ProviderConfigInput,
  ResolvedProviderConfig,
  ProviderFactoryOptions,
} from "./providers";
