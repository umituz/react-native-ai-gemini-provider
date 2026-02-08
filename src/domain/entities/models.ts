export const GEMINI_MODELS = {
  TEXT: {
    FLASH_LITE: "gemini-2.5-flash-lite",
  },
} as const;

export const DEFAULT_MODELS = {
  TEXT: GEMINI_MODELS.TEXT.FLASH_LITE,
} as const;

export const MODEL_PRICING = {
  [GEMINI_MODELS.TEXT.FLASH_LITE]: { input: 0.10, output: 0.40, freePerDay: 1000 },
} as const;
