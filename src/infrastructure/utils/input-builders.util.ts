/**
 * Gemini Input Builders
 * Constructs Gemini API input from normalized data
 */

// =============================================================================
// TYPES
// =============================================================================

export interface UpscaleOptions {
  scaleFactor?: number;
  enhanceFaces?: boolean;
}

export interface PhotoRestoreOptions {
  enhanceFaces?: boolean;
}

export interface FaceSwapOptions {
  // No additional options
}

export interface AnimeSelfieOptions {
  style?: string;
}

export interface RemoveBackgroundOptions {
  // No additional options
}

export interface RemoveObjectOptions {
  mask?: string;
  prompt?: string;
}

export interface ReplaceBackgroundOptions {
  prompt: string;
}

export interface VideoFromImageOptions {
  motion_prompt?: string;
  duration?: number;
}

// =============================================================================
// BASE BUILDERS
// =============================================================================

/**
 * Build Gemini single image input format
 */
export function buildSingleImageInput(
  base64: string,
  prompt: string,
): Record<string, unknown> {
  // Remove data: prefix if present
  const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, "");

  return {
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
        ],
      },
    ],
  };
}

/**
 * Build Gemini dual image input format
 */
export function buildDualImageInput(
  sourceBase64: string,
  targetBase64: string,
  prompt: string,
): Record<string, unknown> {
  const cleanSource = sourceBase64.replace(/^data:image\/\w+;base64,/, "");
  const cleanTarget = targetBase64.replace(/^data:image\/\w+;base64,/, "");

  return {
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: cleanSource } },
          { inlineData: { mimeType: "image/jpeg", data: cleanTarget } },
        ],
      },
    ],
  };
}

// =============================================================================
// FEATURE-SPECIFIC BUILDERS
// =============================================================================

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
 * Build AI hug video input for Gemini
 */
export function buildAIHugInput(
  base64: string,
  options?: VideoFromImageOptions,
): Record<string, unknown> {
  const motionPrompt = options?.motion_prompt || "Create a warm hugging animation";

  const prompt = `Transform this image into a video. ${motionPrompt}. Make it natural and emotional.`;

  return buildSingleImageInput(base64, prompt);
}

/**
 * Build AI kiss video input for Gemini
 */
export function buildAIKissInput(
  base64: string,
  options?: VideoFromImageOptions,
): Record<string, unknown> {
  const motionPrompt = options?.motion_prompt || "Create a kissing animation";

  const prompt = `Transform this image into a video. ${motionPrompt}. Make it romantic and natural.`;

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

// =============================================================================
// VIDEO FEATURE BUILDERS
// =============================================================================

export interface VideoFromDualImageOptions {
  target_image?: string;
  motion_prompt?: string;
  duration?: number;
}

/**
 * Build video from dual images input for Gemini
 * Used for ai-hug and ai-kiss features that need source and target images
 */
export function buildVideoFromDualImagesInput(
  sourceBase64: string,
  options?: VideoFromDualImageOptions,
): Record<string, unknown> {
  const targetBase64 = options?.target_image || "";
  const motionPrompt = options?.motion_prompt || "Create an animated interaction between the two people";

  if (!targetBase64) {
    // Single image case (fallback)
    const prompt = `Transform this image into a video. ${motionPrompt}. Make it natural and emotional.`;
    return buildSingleImageInput(sourceBase64, prompt);
  }

  const prompt = `Transform these two images into a video. ${motionPrompt}. Make it natural and emotional. The first image is the source person, the second is the target person.`;

  return buildDualImageInput(sourceBase64, targetBase64, prompt);
}
