/**
 * Gemini Error Mapper
 * Maps Gemini API errors to standardized format
 */

import {
  GeminiErrorType,
  type GeminiErrorInfo,
  type GeminiApiError,
  GeminiError,
} from "../../domain/entities";

const ERROR_PATTERNS: Array<{
  pattern: RegExp | string[];
  type: GeminiErrorType;
  retryable: boolean;
}> = [
  {
    pattern: ["quota", "resource exhausted", "429"],
    type: GeminiErrorType.QUOTA_EXCEEDED,
    retryable: true,
  },
  {
    pattern: ["rate limit", "too many requests"],
    type: GeminiErrorType.RATE_LIMIT,
    retryable: true,
  },
  {
    pattern: ["unauthorized", "invalid api key", "401", "403", "permission"],
    type: GeminiErrorType.AUTHENTICATION,
    retryable: false,
  },
  {
    pattern: ["safety", "blocked", "harmful"],
    type: GeminiErrorType.SAFETY,
    retryable: false,
  },
  {
    pattern: ["model not found", "404", "not found"],
    type: GeminiErrorType.MODEL_NOT_FOUND,
    retryable: false,
  },
  {
    pattern: ["network", "fetch failed", "connection", "socket"],
    type: GeminiErrorType.NETWORK,
    retryable: true,
  },
  {
    pattern: ["timeout", "timed out"],
    type: GeminiErrorType.TIMEOUT,
    retryable: true,
  },
  {
    pattern: ["500", "502", "503", "504", "internal server", "unavailable"],
    type: GeminiErrorType.SERVER,
    retryable: true,
  },
  {
    pattern: ["invalid", "bad request", "400"],
    type: GeminiErrorType.VALIDATION,
    retryable: false,
  },
];

function getStatusCode(error: unknown): number | undefined {
  if (error && typeof error === "object") {
    const err = error as Record<string, unknown>;
    if (typeof err.status === "number") return err.status;
    if (typeof err.statusCode === "number") return err.statusCode;

    const response = err.response as GeminiApiError | undefined;
    if (response?.error?.code) return response.error.code;
  }
  return undefined;
}

function matchesPattern(message: string, patterns: string[]): boolean {
  const lower = message.toLowerCase();
  return patterns.some((p) => lower.includes(p.toLowerCase()));
}

export function mapGeminiError(error: unknown): GeminiErrorInfo {
  const message = error instanceof Error ? error.message : String(error);
  const statusCode = getStatusCode(error);

  for (const { pattern, type, retryable } of ERROR_PATTERNS) {
    const patterns = Array.isArray(pattern) ? pattern : [pattern.source];

    if (matchesPattern(message, patterns)) {
      return {
        type,
        messageKey: `error.gemini.${type.toLowerCase()}`,
        retryable,
        originalError: error,
        statusCode,
      };
    }
  }

  return {
    type: GeminiErrorType.UNKNOWN,
    messageKey: "error.gemini.unknown",
    retryable: false,
    originalError: error,
    statusCode,
  };
}

export function isGeminiErrorRetryable(error: unknown): boolean {
  return mapGeminiError(error).retryable;
}

export function categorizeGeminiError(error: unknown): GeminiErrorType {
  return mapGeminiError(error).type;
}

/**
 * Create a GeminiError instance from an unknown error
 */
export function createGeminiError(error: unknown): GeminiError {
  const errorInfo = mapGeminiError(error);
  return GeminiError.fromError(error, errorInfo);
}
