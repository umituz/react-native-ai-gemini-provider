/**
 * Video Feature Input Builders
 * Constructs Gemini API inputs for video generation features
 */

import { buildSingleImageInput, buildDualImageInput } from "./base-input-builders.util";
import type { VideoFromImageOptions, VideoFromDualImageOptions } from "./input-builder.types";

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
