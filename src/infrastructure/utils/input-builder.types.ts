/**
 * Input Builder Types
 */

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

export interface VideoFromDualImageOptions {
  target_image?: string;
  motion_prompt?: string;
  duration?: number;
}
