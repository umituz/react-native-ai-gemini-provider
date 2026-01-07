/**
 * Model Validation Utilities
 * Validates model IDs and configurations
 */

import { GEMINI_MODELS, DEFAULT_MODELS } from "../../domain/entities";

declare const __DEV__: boolean;

/**
 * Known valid model IDs
 */
const VALID_MODELS = new Set<string>(
  Object.values(GEMINI_MODELS).flatMap((category) => Object.values(category)),
);

/**
 * Check if a model ID is valid
 */
export function isValidModel(model: string): boolean {
  return VALID_MODELS.has(model);
}

/**
 * Validate model ID and throw if invalid
 */
export function validateModel(model: string): void {
  if (!model) {
    throw new Error("Model ID cannot be empty");
  }

  if (!isValidModel(model)) {
    throw new Error(
      `Invalid model ID: ${model}. Valid models: ${Array.from(VALID_MODELS).join(", ")}`,
    );
  }

  if (typeof __DEV__ !== "undefined" && __DEV__) {
    // eslint-disable-next-line no-console
    console.log("[ModelValidation] Model validated:", model);
  }
}

/**
 * Get a safe model ID (fallback to default if invalid)
 */
export function getSafeModel(model: string | undefined, defaultType: keyof typeof DEFAULT_MODELS): string {
  if (!model) {
    return DEFAULT_MODELS[defaultType];
  }

  if (!isValidModel(model)) {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.warn(`[ModelValidation] Invalid model "${model}", falling back to ${DEFAULT_MODELS[defaultType]}`);
    }
    return DEFAULT_MODELS[defaultType];
  }

  return model;
}

/**
 * Check if model is a text generation model
 */
export function isTextModel(model: string): boolean {
  return Object.values(GEMINI_MODELS.TEXT).includes(model as (typeof GEMINI_MODELS.TEXT)[keyof typeof GEMINI_MODELS.TEXT]);
}

/**
 * Check if model is an image generation model
 */
export function isImageModel(model: string): boolean {
  return Object.values(GEMINI_MODELS.TEXT_TO_IMAGE).includes(model as (typeof GEMINI_MODELS.TEXT_TO_IMAGE)[keyof typeof GEMINI_MODELS.TEXT_TO_IMAGE]);
}

/**
 * Check if model is an image editing model
 */
export function isImageEditModel(model: string): boolean {
  return Object.values(GEMINI_MODELS.IMAGE_EDIT).includes(model as (typeof GEMINI_MODELS.IMAGE_EDIT)[keyof typeof GEMINI_MODELS.IMAGE_EDIT]);
}

/**
 * Check if model is a video generation model
 */
export function isVideoGenerationModel(model: string): boolean {
  return Object.values(GEMINI_MODELS.VIDEO_GENERATION).includes(model as (typeof GEMINI_MODELS.VIDEO_GENERATION)[keyof typeof GEMINI_MODELS.VIDEO_GENERATION]);
}

/**
 * Get model category
 */
export function getModelCategory(model: string): string | null {
  if (isTextModel(model)) return "text";
  if (isImageModel(model)) return "text-to-image";
  if (isImageEditModel(model)) return "image-edit";
  if (isVideoGenerationModel(model)) return "video-generation";
  return null;
}

/**
 * Get all valid model IDs
 */
export function getAllValidModels(): readonly string[] {
  return Array.from(VALID_MODELS);
}
