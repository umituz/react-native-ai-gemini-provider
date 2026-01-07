/**
 * Gemini Input Builders
 * Central export point for all input builder functions
 */

// Base builders
export {
  buildSingleImageInput,
  buildDualImageInput,
} from "./base-input-builders.util";

// Image feature builders
export {
  buildUpscaleInput,
  buildPhotoRestoreInput,
  buildFaceSwapInput,
  buildAnimeSelfieInput,
  buildRemoveBackgroundInput,
  buildRemoveObjectInput,
  buildReplaceBackgroundInput,
  buildHDTouchUpInput,
} from "./image-feature-builders.util";

// Video feature builders
export {
  buildAIHugInput,
  buildAIKissInput,
  buildVideoFromDualImagesInput,
} from "./video-feature-builders.util";

// Types
export type {
  UpscaleOptions,
  PhotoRestoreOptions,
  FaceSwapOptions,
  AnimeSelfieOptions,
  RemoveBackgroundOptions,
  RemoveObjectOptions,
  ReplaceBackgroundOptions,
  VideoFromImageOptions,
  VideoFromDualImageOptions,
} from "./input-builder.types";
