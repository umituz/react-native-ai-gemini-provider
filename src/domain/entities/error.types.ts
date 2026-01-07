/**
 * Gemini Error Types
 * Error classification for Gemini API
 */

export enum GeminiErrorType {
  NETWORK = "NETWORK",
  RATE_LIMIT = "RATE_LIMIT",
  AUTHENTICATION = "AUTHENTICATION",
  VALIDATION = "VALIDATION",
  SAFETY = "SAFETY",
  SERVER = "SERVER",
  TIMEOUT = "TIMEOUT",
  QUOTA_EXCEEDED = "QUOTA_EXCEEDED",
  MODEL_NOT_FOUND = "MODEL_NOT_FOUND",
  UNKNOWN = "UNKNOWN",
}

export interface GeminiErrorInfo {
  type: GeminiErrorType;
  messageKey: string;
  retryable: boolean;
  originalError?: unknown;
  statusCode?: number;
}

export interface GeminiApiError {
  error?: {
    code?: number;
    message?: string;
    status?: string;
    details?: Array<{
      "@type"?: string;
      reason?: string;
      domain?: string;
      metadata?: Record<string, string>;
    }>;
  };
}

/**
 * Custom error class for Gemini API errors
 */
export class GeminiError extends Error {
  readonly type: GeminiErrorType;
  readonly retryable: boolean;
  readonly statusCode?: number;
  readonly originalError?: unknown;

  constructor(info: GeminiErrorInfo) {
    super(info.messageKey);
    this.name = "GeminiError";
    this.type = info.type;
    this.retryable = info.retryable;
    this.statusCode = info.statusCode;
    this.originalError = info.originalError;

    // Maintains proper stack trace (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GeminiError);
    }
  }

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    return this.retryable;
  }

  /**
   * Get error type
   */
  getErrorType(): GeminiErrorType {
    return this.type;
  }

  /**
   * Create GeminiError from unknown error
   */
  static fromError(_error: unknown, info: GeminiErrorInfo): GeminiError {
    return new GeminiError(info);
  }
}
