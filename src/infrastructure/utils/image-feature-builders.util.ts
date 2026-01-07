/**
 * Image Feature Input Builders
 * Constructs Gemini API inputs for image processing features
 */

import { buildSingleImageInput, buildDualImageInput } from "./base-input-builders.util";
import type {
  UpscaleOptions,
  PhotoRestoreOptions,
  FaceSwapOptions,
  AnimeSelfieOptions,
  RemoveBackgroundOptions,
  RemoveObjectOptions,
  ReplaceBackgroundOptions,
} from "./input-builder.types";

/**
 * Build upscale input for Gemini
 */
export function buildUpscaleInput(
  base64: string,
  options?: UpscaleOptions,
): Record<string, unknown> {
  const scale = options?.scaleFactor || 2;
  const faceEnhance = options?.enhanceFaces
    ? " Enhance facial features."
    : "";

  const prompt = `Upscale this image by ${scale}x. Preserve all details, colors and enhance clarity.${faceEnhance}`;

  return buildSingleImageInput(base64, prompt);
}

/**
 * Build photo restore input for Gemini
 */
export function buildPhotoRestoreInput(
  base64: string,
  options?: PhotoRestoreOptions,
): Record<string, unknown> {
  const faceEnhance = options?.enhanceFaces !== false
    ? " Enhance facial features and expressions."
    : "";

  const prompt = `Restore this photo. Remove noise, scratches, and damage while preserving original content.${faceEnhance}`;

  return buildSingleImageInput(base64, prompt);
}

/**
 * Build face swap input for Gemini
 */
export function buildFaceSwapInput(
  sourceBase64: string,
  targetBase64: string,
  _options?: FaceSwapOptions,
): Record<string, unknown> {
  const prompt = "Swap the face from the first image onto the person in the second image. Preserve lighting, expression, and natural appearance.";

  return buildDualImageInput(sourceBase64, targetBase64, prompt);
}

/**
 * Build anime selfie input for Gemini
 */
export function buildAnimeSelfieInput(
  base64: string,
  options?: AnimeSelfieOptions,
): Record<string, unknown> {
  const style = options?.style || "anime";

  const prompt = `Convert this photo into ${style} style. Preserve facial features and expression while applying artistic transformation.`;

  return buildSingleImageInput(base64, prompt);
}

/**
 * Build remove background input for Gemini
 */
export function buildRemoveBackgroundInput(
  base64: string,
  _options?: RemoveBackgroundOptions,
): Record<string, unknown> {
  const prompt = "Remove the background from this image. Keep only the main subject with transparent background.";

  return buildSingleImageInput(base64, prompt);
}

/**
 * Build remove object (inpaint) input for Gemini
 */
export function buildRemoveObjectInput(
  base64: string,
  options?: RemoveObjectOptions,
): Record<string, unknown> {
  const objectDescription = options?.prompt || "the unwanted object";

  const prompt = `Remove ${objectDescription} from this image and fill the area naturally with the surrounding background.`;

  return buildSingleImageInput(base64, prompt);
}

/**
 * Build replace background input for Gemini
 */
export function buildReplaceBackgroundInput(
  base64: string,
  options: ReplaceBackgroundOptions,
): Record<string, unknown> {
  const prompt = `Replace the background with: ${options.prompt}. Keep the main subject intact and blend naturally.`;

  return buildSingleImageInput(base64, prompt);
}

/**
 * Build HD touch up input (same as upscale with face enhancement)
 */
export function buildHDTouchUpInput(
  base64: string,
  options?: UpscaleOptions,
): Record<string, unknown> {
  return buildUpscaleInput(base64, { ...options, enhanceFaces: true });
}
