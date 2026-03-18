/**
 * Categories of errors that can occur with Gemini API
 */
export enum GeminiErrorType {
  /** Network connectivity issues */
  NETWORK = "NETWORK",
  /** API rate limit exceeded */
  RATE_LIMIT = "RATE_LIMIT",
  /** Authentication/authorization failures */
  AUTHENTICATION = "AUTHENTICATION",
  /** Invalid input data or parameters */
  VALIDATION = "VALIDATION",
  /** Content blocked by safety filters */
  SAFETY = "SAFETY",
  /** Server-side errors */
  SERVER = "SERVER",
  /** Request timeout */
  TIMEOUT = "TIMEOUT",
  /** API quota exceeded */
  QUOTA_EXCEEDED = "QUOTA_EXCEEDED",
  /** Requested model not found */
  MODEL_NOT_FOUND = "MODEL_NOT_FOUND",
  /** Unknown/unclassified error */
  UNKNOWN = "UNKNOWN",
}

/**
 * Detailed error information for Gemini API errors
 */
export interface GeminiErrorInfo {
  /** Category of the error */
  type: GeminiErrorType;
  /** Message key for i18n translation */
  messageKey: string;
  /** Whether the request can be retried */
  retryable: boolean;
  /** Original error that caused this error */
  originalError?: unknown;
  /** HTTP status code if applicable */
  statusCode?: number;
}

/**
 * Structure of Gemini API error responses
 */
export interface GeminiApiError {
  error?: {
    /** Error code */
    code?: number;
    /** Error message */
    message?: string;
    /** Error status */
    status?: string;
    /** Additional error details */
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
 * Provides structured error information and retry capability
 */
export class GeminiError extends Error {
  /** Error category */
  readonly type: GeminiErrorType;
  /** Whether the operation can be retried */
  readonly retryable: boolean;
  /** HTTP status code if applicable */
  readonly statusCode?: number;
  /** Original error that caused this error */
  readonly originalError?: unknown;

  /**
   * Create a new GeminiError
   * @param info - Error information
   */
  constructor(info: GeminiErrorInfo) {
    super(info.messageKey);
    this.name = "GeminiError";
    this.type = info.type;
    this.retryable = info.retryable;
    this.statusCode = info.statusCode;
    this.originalError = info.originalError;
  }

  /**
   * Check if this error is retryable
   * @returns true if the operation can be retried
   */
  isRetryable(): boolean {
    return this.retryable;
  }

  /**
   * Get the error type
   * @returns The error category
   */
  getErrorType(): GeminiErrorType {
    return this.type;
  }

  /**
   * Create a GeminiError from an unknown error
   * @param error - The original error
   * @param info - Error information
   * @returns A new GeminiError instance
   */
  static fromError(error: unknown, info: GeminiErrorInfo): GeminiError {
    const geminiError = new GeminiError(info);

    // Preserve original error's stack trace for better debugging
    if (error instanceof Error && error.stack) {
      geminiError.stack = `${geminiError.stack}\nCaused by: ${error.stack}`;
    }

    return geminiError;
  }
}
