/**
 * Gemini Model Constants
 * Centralized model configuration for all AI operations
 * Updated: 2026-01 with latest pricing and free tier info
 */

/**
 * Available Gemini models
 * Pricing (per 1M tokens):
 * - Flash-Lite: $0.10 input / $0.40 output (FREE: 1000 req/day)
 */
export const GEMINI_MODELS = {
  // Text generation models (ordered by cost: cheapest first)
  TEXT: {
    /** Most cost-effective, 1000 free requests/day */
    FLASH_LITE: "gemini-2.5-flash-lite",
  },
} as const;

/**
 * Default models for each operation type
 * Optimized for cost-effectiveness while maintaining quality
 * Using Flash-Lite as default for best free tier (1000 req/day)
 */
export const DEFAULT_MODELS = {
  /** Flash-Lite: Cheapest & highest free tier (1000/day) */
  TEXT: GEMINI_MODELS.TEXT.FLASH_LITE,
} as const;

/**
 * Model pricing information (per 1M tokens)
 */
export const MODEL_PRICING = {
  [GEMINI_MODELS.TEXT.FLASH_LITE]: { input: 0.10, output: 0.40, freePerDay: 1000 },
} as const;

/**
 * Response modalities for different generation types
 */
export const RESPONSE_MODALITIES = {
  TEXT_ONLY: ["TEXT"] as const,
} as const;

export type ResponseModality = "TEXT";
