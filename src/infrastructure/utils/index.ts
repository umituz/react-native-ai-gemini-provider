// Error handling
export { mapGeminiError, isGeminiErrorRetryable, categorizeGeminiError, createGeminiError } from "./error-mapper.util";

// Data transformation
export { extractTextFromResponse } from "./gemini-data-transformer.util";
export { cleanJsonText, parseJsonResponse, safeParseJson, extractJsonFromText } from "./json-parser.util";
export { toSdkContent, createTextContent, transformCandidate, transformResponse, extractTextFromParts } from "./content-mapper.util";

// Performance
export { measureAsync, measureSync, debounce, throttle, PerformanceTimer } from "./performance.util";
export type { PerformanceMetrics } from "./performance.util";

// Rate limiting
export { RateLimiter } from "./rate-limiter.util";
export type { RateLimiterOptions } from "./rate-limiter.util";

// Retry logic
export { retryWithBackoff, retryIf, retryWithFixedDelay, shouldRetryNetworkError, createRetryPredicate } from "./retry.util";
export type { RetryOptions, RetryResult } from "./retry.util";

// Validation
export { validateModelName, validateApiKey, validateSchema, validatePrompt, validateTimeout, isValidObject, validateRequiredFields } from "./validation.util";

// Environment
export { getRequiredEnv, getOptionalEnv, getEnvNumber, getEnvBoolean, loadGeminiEnv, getApiKeyFromEnv, isDevelopment, isDebugEnabled, validateEnv, getGeminiConfigFromEnv } from "./env.util";
export type { EnvConfig } from "./env.util";

// Async state management
export { executeWithState, createDebouncedAsync, createMemoizedAsync } from "./async";
export type { AsyncStateCallbacks, AsyncStateSetters, AsyncStateConfig } from "./async";
