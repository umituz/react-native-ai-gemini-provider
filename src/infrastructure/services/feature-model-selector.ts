/**
 * Feature Model Selector
 * Returns the appropriate model ID for a given feature
 * Supports runtime model overrides for flexibility
 */

import type {
  ImageFeatureType,
  VideoFeatureType,
} from "@umituz/react-native-ai-generation-content";
import {
  GEMINI_IMAGE_FEATURE_MODELS,
  GEMINI_VIDEO_FEATURE_MODELS,
} from "../../domain/constants/feature-models.constants";

declare const __DEV__: boolean;

type ModelOverrideMap = Partial<Record<ImageFeatureType | VideoFeatureType, string>>;

class FeatureModelSelector {
  private overrides: ModelOverrideMap = {};

  /**
   * Set model override for a specific feature
   * This allows runtime configuration without modifying constants
   */
  setModelOverride(feature: ImageFeatureType | VideoFeatureType, model: string): void {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[FeatureModelSelector] Model override set:", { feature, model });
    }
    this.overrides[feature] = model;
  }

  /**
   * Clear all model overrides
   */
  clearOverrides(): void {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[FeatureModelSelector] All model overrides cleared");
    }
    this.overrides = {};
  }

  /**
   * Get model ID for an IMAGE feature
   * Returns override if set, otherwise returns default model
   */
  getImageFeatureModel(feature: ImageFeatureType): string {
    return this.overrides[feature] ?? GEMINI_IMAGE_FEATURE_MODELS[feature];
  }

  /**
   * Get model ID for a VIDEO feature
   * Returns override if set, otherwise returns default model
   */
  getVideoFeatureModel(feature: VideoFeatureType): string {
    return this.overrides[feature] ?? GEMINI_VIDEO_FEATURE_MODELS[feature];
  }

  /**
   * Check if a feature has a custom override
   */
  hasOverride(feature: ImageFeatureType | VideoFeatureType): boolean {
    return feature in this.overrides;
  }

  /**
   * Get all current overrides
   */
  getOverrides(): ModelOverrideMap {
    return { ...this.overrides };
  }
}

export const featureModelSelector = new FeatureModelSelector();
