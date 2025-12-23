/**
 * Provider Configuration
 * Centralized configuration for AI provider with tier-based settings
 */

export type SubscriptionTier = "free" | "premium";

export type QualityPreference = "fast" | "balanced" | "high";

export interface ProviderPreferences {
  /** Quality preference (fast = Flash, balanced = Flash, high = Pro) */
  quality?: QualityPreference;
  /** Maximum retry attempts for failed requests */
  maxRetries?: number;
  /** Base delay for retry backoff (ms) */
  baseDelay?: number;
  /** Maximum delay for retry backoff (ms) */
  maxDelay?: number;
  /** Request timeout (ms) */
  timeout?: number;
}

export interface ProviderConfigInput {
  /** API key for authentication */
  apiKey: string;
  /** Subscription tier (determines default models and limits) */
  subscriptionTier: SubscriptionTier;
  /** Optional user preferences (overrides tier defaults) */
  preferences?: ProviderPreferences;
}

export interface ResolvedProviderConfig {
  apiKey: string;
  subscriptionTier: SubscriptionTier;
  textModel: string;
  imageGenerationModel: string;
  imageEditModel: string;
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  timeout: number;
}

/**
 * Default configurations per subscription tier
 */
const TIER_DEFAULTS: Record<
  SubscriptionTier,
  Omit<ResolvedProviderConfig, "apiKey" | "subscriptionTier">
> = {
  free: {
    textModel: "gemini-2.5-flash",
    imageGenerationModel: "imagen-4.0-generate-001",
    imageEditModel: "gemini-2.5-flash-image", // Fast model for free tier
    maxRetries: 1, // Limited retries for free tier
    baseDelay: 1000,
    maxDelay: 5000,
    timeout: 30000, // 30 seconds
  },
  premium: {
    textModel: "gemini-2.5-flash",
    imageGenerationModel: "imagen-4.0-generate-001",
    imageEditModel: "gemini-3-pro-image-preview", // High quality for premium
    maxRetries: 2, // More retries for premium
    baseDelay: 1000,
    maxDelay: 10000,
    timeout: 60000, // 60 seconds
  },
};

/**
 * Quality preference to model mapping
 */
const QUALITY_TO_MODEL: Record<QualityPreference, string> = {
  fast: "gemini-2.5-flash-image",
  balanced: "gemini-2.5-flash-image",
  high: "gemini-3-pro-image-preview",
};

/**
 * Resolve provider configuration based on tier and preferences
 */
export function resolveProviderConfig(
  input: ProviderConfigInput,
): ResolvedProviderConfig {
  const tierDefaults = TIER_DEFAULTS[input.subscriptionTier];
  const preferences = input.preferences || {};

  // Override image edit model if quality preference is provided
  let imageEditModel = tierDefaults.imageEditModel;
  if (preferences.quality) {
    imageEditModel = QUALITY_TO_MODEL[preferences.quality];
  }

  return {
    apiKey: input.apiKey,
    subscriptionTier: input.subscriptionTier,
    textModel: tierDefaults.textModel,
    imageGenerationModel: tierDefaults.imageGenerationModel,
    imageEditModel,
    maxRetries: preferences.maxRetries ?? tierDefaults.maxRetries,
    baseDelay: preferences.baseDelay ?? tierDefaults.baseDelay,
    maxDelay: preferences.maxDelay ?? tierDefaults.maxDelay,
    timeout: preferences.timeout ?? tierDefaults.timeout,
  };
}

/**
 * Get cost-optimized config (always use fastest/cheapest models)
 * Useful for development or cost-sensitive scenarios
 */
export function getCostOptimizedConfig(
  input: ProviderConfigInput,
): ResolvedProviderConfig {
  const resolved = resolveProviderConfig(input);
  return {
    ...resolved,
    imageEditModel: "gemini-2.5-flash-image", // Always use fast model
    maxRetries: 0, // No retries to minimize cost
  };
}

/**
 * Get quality-optimized config (always use best models)
 * Useful for production or quality-critical scenarios
 */
export function getQualityOptimizedConfig(
  input: ProviderConfigInput,
): ResolvedProviderConfig {
  const resolved = resolveProviderConfig(input);
  return {
    ...resolved,
    imageEditModel: "gemini-3-pro-image-preview", // Always use pro model
    maxRetries: 2, // More retries for reliability
    timeout: 60000, // Longer timeout
  };
}
