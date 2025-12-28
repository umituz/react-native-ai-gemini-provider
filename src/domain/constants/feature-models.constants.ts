/**
 * Gemini Feature Models Catalog
 * Provider-specific model IDs for image and video processing features
 */

import type {
  ImageFeatureType,
  VideoFeatureType,
} from "@umituz/react-native-ai-generation-content";

export interface FeatureModelConfig {
  id: string;
  feature: ImageFeatureType | VideoFeatureType;
  description?: string;
}

/**
 * Gemini model IDs for IMAGE processing features
 * Using gemini-2.0-flash-exp for image editing capabilities
 */
export const GEMINI_IMAGE_FEATURE_MODELS: Record<ImageFeatureType, string> = {
  "upscale": "gemini-2.0-flash-exp",
  "photo-restore": "gemini-2.0-flash-exp",
  "face-swap": "gemini-2.0-flash-exp",
  "anime-selfie": "gemini-2.0-flash-exp",
  "remove-background": "gemini-2.0-flash-exp",
  "remove-object": "gemini-2.0-flash-exp",
  "hd-touch-up": "gemini-2.0-flash-exp",
  "replace-background": "gemini-2.0-flash-exp",
};

/**
 * Gemini model IDs for VIDEO generation features
 * Using gemini-2.0-flash-exp for video generation capabilities
 */
export const GEMINI_VIDEO_FEATURE_MODELS: Record<VideoFeatureType, string> = {
  "ai-hug": "gemini-2.0-flash-exp",
  "ai-kiss": "gemini-2.0-flash-exp",
};

/**
 * Get Gemini model ID for an image feature
 */
export function getGeminiImageFeatureModel(feature: ImageFeatureType): string {
  return GEMINI_IMAGE_FEATURE_MODELS[feature];
}

/**
 * Get Gemini model ID for a video feature
 */
export function getGeminiVideoFeatureModel(feature: VideoFeatureType): string {
  return GEMINI_VIDEO_FEATURE_MODELS[feature];
}

/**
 * Get all feature model configs
 */
export function getAllFeatureModels(): FeatureModelConfig[] {
  const imageModels = Object.entries(GEMINI_IMAGE_FEATURE_MODELS).map(([feature, id]) => ({
    id,
    feature: feature as ImageFeatureType,
  }));

  const videoModels = Object.entries(GEMINI_VIDEO_FEATURE_MODELS).map(([feature, id]) => ({
    id,
    feature: feature as VideoFeatureType,
  }));

  return [...imageModels, ...videoModels];
}
