/**
 * Environment Configuration Utilities
 * Safe loading and validation of environment variables
 */

/**
 * Get environment variable with type safety
 */
function getEnvVar(key: string): string | undefined {
  // Check for React Native environment
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }

  // For React Native, apps typically use a config file
  // This returns undefined if not available - app should provide config directly
  return undefined;
}

/**
 * Get required environment variable
 * @throws Error if variable is not set
 */
export function getRequiredEnv(key: string): string {
  const value = getEnvVar(key);

  if (!value || value.trim().length === 0) {
    throw new Error(`Required environment variable "${key}" is not set`);
  }

  return value.trim();
}

/**
 * Get optional environment variable with fallback
 */
export function getOptionalEnv(
  key: string,
  fallback: string,
): string {
  const value = getEnvVar(key);
  return value?.trim() || fallback;
}

/**
 * Get environment variable as number
 */
export function getEnvNumber(key: string, fallback: number): number {
  const value = getEnvVar(key);

  if (!value) {
    return fallback;
  }

  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    return fallback;
  }

  return parsed;
}

/**
 * Get environment variable as boolean
 */
export function getEnvBoolean(key: string, fallback: boolean): boolean {
  const value = getEnvVar(key);

  if (!value) {
    return fallback;
  }

  return value.toLowerCase() === "true" || value === "1";
}

/**
 * Environment configuration interface
 */
export interface EnvConfig {
  /** Gemini API key */
  GEMINI_API_KEY?: string;
  /** Default timeout in milliseconds */
  GEMINI_TIMEOUT?: number;
  /** Enable debug logging */
  GEMINI_DEBUG?: boolean;
  /** Max retry attempts */
  GEMINI_MAX_RETRIES?: number;
}

/**
 * Load all Gemini-related environment variables
 */
export function loadGeminiEnv(): EnvConfig {
  return {
    GEMINI_API_KEY: getEnvVar("GEMINI_API_KEY"),
    GEMINI_TIMEOUT: getEnvNumber("GEMINI_TIMEOUT", 30000),
    GEMINI_DEBUG: getEnvBoolean("GEMINI_DEBUG", false),
    GEMINI_MAX_RETRIES: getEnvNumber("GEMINI_MAX_RETRIES", 3),
  };
}

/**
 * Get API key from environment with validation
 * @throws Error if API key is not set or invalid
 */
export function getApiKeyFromEnv(): string {
  const apiKey = getRequiredEnv("GEMINI_API_KEY");

  if (apiKey.length < 10) {
    throw new Error("GEMINI_API_KEY appears to be invalid (too short)");
  }

  return apiKey;
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return getEnvBoolean("NODE_ENV", false) === false ||
    getEnvVar("NODE_ENV") === "development";
}

/**
 * Check if debug mode is enabled
 */
export function isDebugEnabled(): boolean {
  return getEnvBoolean("GEMINI_DEBUG", false) ||
    getEnvBoolean("DEBUG", false);
}

/**
 * Validate that required environment variables are set
 * @returns Array of missing variable names
 */
export function validateEnv(requiredVars: string[]): string[] {
  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!getEnvVar(varName)) {
      missing.push(varName);
    }
  }

  return missing;
}

/**
 * Get configuration from environment or use provided fallback
 * @throws Error if API key is not configured in either env or fallback
 */
export function getGeminiConfigFromEnv(fallback?: {
  apiKey?: string;
  timeout?: number;
}): {
  apiKey: string;
  timeout?: number;
} {
  const env = loadGeminiEnv();

  const apiKey = env.GEMINI_API_KEY || fallback?.apiKey;

  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error(
      "GEMINI_API_KEY must be set either in environment variables or provided as fallback. " +
      "Set the GEMINI_API_KEY environment variable or pass apiKey in the fallback config."
    );
  }

  return {
    apiKey,
    timeout: env.GEMINI_TIMEOUT || fallback?.timeout,
  };
}
