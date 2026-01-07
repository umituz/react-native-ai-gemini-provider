/**
 * Feature Input Builder
 * Builds Gemini API inputs for image and video features
 */

import type {
  ImageFeatureType,
  VideoFeatureType,
  ImageFeatureInputData,
  VideoFeatureInputData,
} from "@umituz/react-native-ai-generation-content";
import {
  buildUpscaleInput,
  buildPhotoRestoreInput,
  buildFaceSwapInput,
  buildAnimeSelfieInput,
  buildRemoveBackgroundInput,
  buildRemoveObjectInput,
  buildReplaceBackgroundInput,
  buildHDTouchUpInput,
  buildVideoFromDualImagesInput,
} from "../utils/input-builders.util";

class FeatureInputBuilder {
  /**
   * Build input for an IMAGE feature
   */
  buildImageFeatureInput(
    feature: ImageFeatureType,
    data: ImageFeatureInputData,
  ): Record<string, unknown> {
    const { imageBase64, targetImageBase64, prompt, options } = data;

    switch (feature) {
      case "upscale":
        return buildUpscaleInput(imageBase64, options);
      case "photo-restore":
        return buildPhotoRestoreInput(imageBase64, options);
      case "face-swap":
        if (!targetImageBase64) {
          throw new Error("Face swap requires target image");
        }
        return buildFaceSwapInput(imageBase64, targetImageBase64, options);
      case "anime-selfie":
        return buildAnimeSelfieInput(imageBase64, options);
      case "remove-background":
        return buildRemoveBackgroundInput(imageBase64, options);
      case "remove-object":
        return buildRemoveObjectInput(imageBase64, { prompt, ...options });
      case "hd-touch-up":
        return buildHDTouchUpInput(imageBase64, options);
      case "replace-background":
        if (!prompt) {
          throw new Error("Replace background requires prompt");
        }
        return buildReplaceBackgroundInput(imageBase64, { prompt });
      default:
        throw new Error(`Unknown image feature: ${String(feature)}`);
    }
  }

  /**
   * Build input for a VIDEO feature
   */
  buildVideoFeatureInput(
    feature: VideoFeatureType,
    data: VideoFeatureInputData,
  ): Record<string, unknown> {
    const { sourceImageBase64, targetImageBase64, prompt, options } = data;

    switch (feature) {
      case "ai-hug":
      case "ai-kiss":
        return buildVideoFromDualImagesInput(sourceImageBase64, {
          target_image: targetImageBase64,
          motion_prompt: prompt,
          ...options,
        });
      default:
        throw new Error(`Unknown video feature: ${String(feature)}`);
    }
  }
}

export const featureInputBuilder = new FeatureInputBuilder();
