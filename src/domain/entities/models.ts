/**
 * Gemini Model Constants
 * Centralized model configuration for all AI operations
 */

/**
 * Available Gemini models
 * Updated: 2025-12 with latest stable and preview models
 */
export const GEMINI_MODELS = {
  // Text generation models
  TEXT: {
    FLASH: "gemini-2.5-flash",
    FLASH_LITE: "gemini-2.5-flash-lite",
    PRO: "gemini-2.5-pro",
  },

  // Text-to-Image models (Imagen 4.0) - generates images from text only
  TEXT_TO_IMAGE: {
    DEFAULT: "imagen-4.0-generate-001",
  },

  // Image editing models - transforms/edits images with input image + prompt
  // gemini-3-pro-image-preview is the highest quality for identity preservation
  IMAGE_EDIT: {
    DEFAULT: "gemini-3-pro-image-preview",
    FAST: "gemini-2.5-flash-image",
    LEGACY: "gemini-2.0-flash-preview-image-generation",
  },

  // Video understanding models
  VIDEO: {
    FLASH: "gemini-2.5-flash",
  },
} as const;

/**
 * Default models for each operation type
 */
export const DEFAULT_MODELS = {
  TEXT: GEMINI_MODELS.TEXT.FLASH,
  TEXT_TO_IMAGE: GEMINI_MODELS.TEXT_TO_IMAGE.DEFAULT,
  IMAGE_EDIT: GEMINI_MODELS.IMAGE_EDIT.DEFAULT,
  VIDEO: GEMINI_MODELS.VIDEO.FLASH,
} as const;

/**
 * Response modalities for different generation types
 */
export const RESPONSE_MODALITIES = {
  TEXT_ONLY: ["TEXT"] as const,
  IMAGE_ONLY: ["IMAGE"] as const,
  TEXT_AND_IMAGE: ["TEXT", "IMAGE"] as const,
} as const;

export type ResponseModality = "TEXT" | "IMAGE";


