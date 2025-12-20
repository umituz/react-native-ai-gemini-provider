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
