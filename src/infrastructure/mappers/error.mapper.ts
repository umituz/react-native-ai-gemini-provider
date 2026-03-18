/**
 * Error Mapper
 * Maps unknown errors to domain GeminiError
 */

import { GeminiError, GeminiErrorType } from "../../domain/entities";

const ERROR_PATTERNS: Array<{
  pattern: string[];
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
    pattern: ["safety", "safety filter", "harmful", "blocked by safety"],
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

const STATUS_CODE_MAP: Record<
  number,
  { type: GeminiErrorType; retryable: boolean }
> = {
  400: { type: GeminiErrorType.VALIDATION, retryable: false },
  401: { type: GeminiErrorType.AUTHENTICATION, retryable: false },
  403: { type: GeminiErrorType.AUTHENTICATION, retryable: false },
  404: { type: GeminiErrorType.MODEL_NOT_FOUND, retryable: false },
  429: { type: GeminiErrorType.RATE_LIMIT, retryable: true },
  500: { type: GeminiErrorType.SERVER, retryable: true },
  502: { type: GeminiErrorType.SERVER, retryable: true },
  503: { type: GeminiErrorType.SERVER, retryable: true },
  504: { type: GeminiErrorType.SERVER, retryable: true },
};

export class ErrorMapper {
  /**
   * Map unknown error to GeminiError
   */
  static map(error: unknown, context: string): GeminiError {
    if (error instanceof GeminiError) {
      return error;
    }

    const message = error instanceof Error ? error.message : String(error);
    const statusCode = ErrorMapper.extractStatusCode(error);

    // Primary: classify by HTTP status code
    if (statusCode && STATUS_CODE_MAP[statusCode]) {
      const { type, retryable } = STATUS_CODE_MAP[statusCode];
      return GeminiError.fromError(error, {
        type,
        messageKey: `error.gemini.${type.toLowerCase()}`,
        retryable,
        originalError: error,
        statusCode,
      });
    }

    // Secondary: classify by message pattern
    for (const { pattern, type, retryable } of ERROR_PATTERNS) {
      if (ErrorMapper.matchesPattern(message, pattern)) {
        return GeminiError.fromError(error, {
          type,
          messageKey: `error.gemini.${type.toLowerCase()}`,
          retryable,
          originalError: error,
          statusCode,
        });
      }
    }

    // Default: unknown error
    return GeminiError.fromError(error, {
      type: GeminiErrorType.UNKNOWN,
      messageKey: "error.gemini.unknown",
      retryable: false,
      originalError: error,
      statusCode,
    });
  }

  /**
   * Extract HTTP status code from error
   */
  private static extractStatusCode(error: unknown): number | undefined {
    if (error && typeof error === "object") {
      const err = error as Record<string, unknown>;
      if (typeof err.status === "number") return err.status;
      if (typeof err.statusCode === "number") return err.statusCode;

      const response = err.response as
        | { error?: { code?: number } }
        | undefined;
      if (response?.error?.code) return response.error.code;
    }
    return undefined;
  }

  /**
   * Check if message matches any pattern
   */
  private static matchesPattern(message: string, patterns: string[]): boolean {
    const lower = message.toLowerCase();
    return patterns.some((pattern) => {
      const words = pattern.toLowerCase().split(/\s+/);
      return words.every((word) => {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(`\\b${escaped}\\b`, "i").test(lower);
      });
    });
  }
}
