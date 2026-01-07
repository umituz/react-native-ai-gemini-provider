/**
 * Infrastructure Utils
 */

export {
  mapGeminiError,
  isGeminiErrorRetryable,
  categorizeGeminiError,
  createGeminiError,
} from "./error-mapper.util";

export {
  extractBase64Data,
  extractTextFromResponse,
} from "./gemini-data-transformer.util";

export {
  prepareImageFromUri,
  prepareImage,
  isValidBase64,
} from "./image-preparer.util";
export type { PreparedImage } from "./image-preparer.util";

export {
  isValidModel,
  validateModel,
  getSafeModel,
  isTextModel,
  isImageModel,
  isImageEditModel,
  isVideoGenerationModel,
  getModelCategory,
  getAllValidModels,
} from "./model-validation.util";

export {
  measureAsync,
  measureSync,
  debounce,
  throttle,
  PerformanceTimer,
  PerformanceTracker,
  performanceTracker,
} from "./performance.util";
export type { PerformanceMetrics } from "./performance.util";

// Input builders
export {
  buildSingleImageInput,
  buildDualImageInput,
  buildUpscaleInput,
  buildPhotoRestoreInput,
  buildAIHugInput,
  buildAIKissInput,
  buildFaceSwapInput,
  buildAnimeSelfieInput,
  buildRemoveBackgroundInput,
  buildRemoveObjectInput,
  buildReplaceBackgroundInput,
  buildHDTouchUpInput,
  buildVideoFromDualImagesInput,
} from "./input-builders.util";

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
} from "./input-builders.util";
