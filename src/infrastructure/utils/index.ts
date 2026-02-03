/**
 * Infrastructure Utils
 * Text-only utilities
 */

export {
  mapGeminiError,
  isGeminiErrorRetryable,
  categorizeGeminiError,
  createGeminiError,
} from "./error-mapper.util";

export {
  extractBase64Data,
  extractTextFromResponse,
} from "./gemini-data-transformer.util";

export {
  isValidModel,
  validateModel,
  getSafeModel,
  isTextModel,
  getModelCategory,
  getAllValidModels,
} from "./model-validation.util";

export {
  measureAsync,
  measureSync,
  debounce,
  throttle,
  PerformanceTimer,
  PerformanceTracker,
  performanceTracker,
} from "./performance.util";
export type { PerformanceMetrics } from "./performance.util";

export {
  RateLimiter,
  rateLimiter,
} from "./rate-limiter.util";
export type { RateLimiterOptions } from "./rate-limiter.util";

export { executeWithState } from "./async-state.util";
export type { AsyncStateCallbacks, AsyncStateSetters } from "./async-state.util";
