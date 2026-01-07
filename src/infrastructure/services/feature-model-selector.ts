/**
 * Feature Model Selector
 * Returns the appropriate model ID for a given feature
 */

import type {
  ImageFeatureType,
  VideoFeatureType,
} from "@umituz/react-native-ai-generation-content";
import {
  GEMINI_IMAGE_FEATURE_MODELS,
  GEMINI_VIDEO_FEATURE_MODELS,
} from "../../domain/constants/feature-models.constants";

class FeatureModelSelector {
  /**
   * Get model ID for an IMAGE feature
   */
  getImageFeatureModel(feature: ImageFeatureType): string {
    return GEMINI_IMAGE_FEATURE_MODELS[feature];
  }

  /**
   * Get model ID for a VIDEO feature
   */
  getVideoFeatureModel(feature: VideoFeatureType): string {
    return GEMINI_VIDEO_FEATURE_MODELS[feature];
  }
}

export const featureModelSelector = new FeatureModelSelector();
