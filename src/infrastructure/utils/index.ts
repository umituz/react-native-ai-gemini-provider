/**
 * Utility Functions - Internal Use Only
 * These are internal implementation details and should not be used directly by consumers
 */

// Error handling (internal)
export {
  mapGeminiError,
  isGeminiErrorRetryable,
  categorizeGeminiError,
  createGeminiError
} from "./error-mapper.util";

// Data transformation (internal)
export { extractTextFromResponse } from "./gemini-data-transformer.util";
export {
  cleanJsonText,
  parseJsonResponse,
  safeParseJson,
  extractJsonFromText
} from "./json-parser.util";
export {
  toSdkContent,
  createTextContent,
  transformCandidate,
  transformResponse,
  extractTextFromParts
} from "./content-mapper.util";

// Validation (internal)
export {
  validateModelName,
  validateApiKey,
  validateSchema,
  validatePrompt,
  validateTimeout,
  isValidObject,
  validateRequiredFields
} from "./validation.util";

// Async state management (internal)
export {
  executeWithState,
  type AsyncStateCallbacks,
  type AsyncStateSetters,
  type AsyncStateConfig
} from "./async";
