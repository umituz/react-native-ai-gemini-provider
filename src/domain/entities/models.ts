/**
 * Gemini Model Constants
 * Centralized model configuration for all AI operations
 * Updated: 2026-01 with latest pricing and free tier info
 */

/**
 * Available Gemini models
 * Pricing (per 1M tokens):
 * - Flash-Lite: $0.10 input / $0.40 output (FREE: 1000 req/day)
 * - Flash: $0.15 input / $0.60 output (FREE: 20 req/day)
 * - Pro: $1.25 input / $10.00 output (FREE: 25 req/day)
 */
export const GEMINI_MODELS = {
  // Text generation models (ordered by cost: cheapest first)
  TEXT: {
    /** Most cost-effective, 1000 free requests/day */
    FLASH_LITE: "gemini-2.5-flash-lite",
    /** Good balance of speed and quality */
    FLASH: "gemini-2.5-flash",
    /** Highest quality, best for complex reasoning */
    PRO: "gemini-2.5-pro",
  },

  // Text-to-Image models (Imagen 4.0) - generates images from text only
  TEXT_TO_IMAGE: {
    DEFAULT: "imagen-4.0-generate-001",
  },

  // Image editing models - transforms/edits images with input image + prompt
  // gemini-2.5-flash-image is the most cost-effective (500 images/day free tier)
  IMAGE_EDIT: {
    DEFAULT: "gemini-2.5-flash-image",
    HIGH_QUALITY: "gemini-3-pro-image-preview",
    LEGACY: "gemini-2.0-flash-preview-image-generation",
  },

  // Video understanding models (analysis only)
  VIDEO: {
    FLASH: "gemini-2.5-flash",
  },

  // Video generation models (Google Veo)
  // See: https://ai.google.dev/gemini-api/docs/video
  VIDEO_GENERATION: {
    DEFAULT: "veo-3.1-generate-preview",
    VEO_3: "veo-3-generate-preview",
    VEO_2: "veo-2-generate",
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
  TEXT_TO_IMAGE: GEMINI_MODELS.TEXT_TO_IMAGE.DEFAULT,
  IMAGE_EDIT: GEMINI_MODELS.IMAGE_EDIT.DEFAULT,
  VIDEO: GEMINI_MODELS.VIDEO.FLASH,
  VIDEO_GENERATION: GEMINI_MODELS.VIDEO_GENERATION.DEFAULT,
} as const;

/**
 * Model pricing information (per 1M tokens)
 */
export const MODEL_PRICING = {
  [GEMINI_MODELS.TEXT.FLASH_LITE]: { input: 0.10, output: 0.40, freePerDay: 1000 },
  [GEMINI_MODELS.TEXT.FLASH]: { input: 0.15, output: 0.60, freePerDay: 20 },
  [GEMINI_MODELS.TEXT.PRO]: { input: 1.25, output: 10.00, freePerDay: 25 },
} as const;

/**
 * Response modalities for different generation types
 */
export const RESPONSE_MODALITIES = {
  TEXT_ONLY: ["TEXT"] as const,
  IMAGE_ONLY: ["IMAGE"] as const,
  VIDEO_ONLY: ["VIDEO"] as const,
  TEXT_AND_IMAGE: ["TEXT", "IMAGE"] as const,
} as const;

export type ResponseModality = "TEXT" | "IMAGE" | "VIDEO";


