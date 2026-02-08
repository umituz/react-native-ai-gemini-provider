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

  isRetryable(): boolean {
    return this.retryable;
  }

  getErrorType(): GeminiErrorType {
    return this.type;
  }

  static fromError(error: unknown, info: GeminiErrorInfo): GeminiError {
    const geminiError = new GeminiError(info);

    // If original error was an Error, preserve its stack trace
    if (error instanceof Error && error.stack && !geminiError.stack) {
      geminiError.stack = error.stack;
    }

    return geminiError;
  }
}
