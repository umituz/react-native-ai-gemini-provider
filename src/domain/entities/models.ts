/**
 * Available Gemini AI models
 */
export const GEMINI_MODELS = {
  /** Text generation models */
  TEXT: {
    /** Lightweight flash model for fast text generation */
    FLASH_LITE: "gemini-2.5-flash-lite",
  },
} as const;

/**
 * Default models to use for each category
 */
export const DEFAULT_MODELS = {
  /** Default model for text generation */
  TEXT: GEMINI_MODELS.TEXT.FLASH_LITE,
} as const;

/**
 * Pricing information for Gemini models
 * Prices are per 1M tokens (USD)
 */
export const MODEL_PRICING = {
  [GEMINI_MODELS.TEXT.FLASH_LITE]: { input: 0.10, output: 0.40, freePerDay: 1000 },
} as const;
