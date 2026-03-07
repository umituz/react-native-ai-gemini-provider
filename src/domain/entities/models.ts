/**
 * Available Gemini AI models
 */
export const GEMINI_MODELS = {
  /** Text generation models */
  TEXT: {
    /** Lightweight flash model for fast text generation */
    FLASH_LITE: "gemini-2.5-flash-lite",
    /** Balanced flash model for general use */
    FLASH: "gemini-2.5-flash",
    /** Premium model for complex tasks */
    PRO: "gemini-2.5-pro",
  },
} as const;

/**
 * Default models to use for each category
 */
export const DEFAULT_MODELS = {
  /** Default model for text generation */
  TEXT: GEMINI_MODELS.TEXT.FLASH_LITE,
  /** Default model for chat sessions */
  CHAT: GEMINI_MODELS.TEXT.FLASH,
} as const;
