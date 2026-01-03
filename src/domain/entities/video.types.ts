/**
 * Video Generation Types
 * Type definitions for Google Veo video generation
 */

/**
 * Video aspect ratio options
 */
export type VideoAspectRatio = "9:16" | "16:9" | "1:1";

/**
 * Video resolution options
 */
export type VideoResolution = "720p" | "1080p" | "4K";

/**
 * Video generation operation status
 */
export type VideoOperationStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

/**
 * Video generation configuration options
 */
export interface VideoGenerationOptions {
  numberOfVideos?: number;
  aspectRatio?: VideoAspectRatio;
  resolution?: VideoResolution;
  duration?: number;
}

/**
 * Input for text-to-video generation
 */
export interface TextToVideoInput {
  prompt: string;
  negativePrompt?: string;
  options?: VideoGenerationOptions;
}

/**
 * Input for image-to-video generation
 */
export interface ImageToVideoInput {
  prompt: string;
  image: string;
  negativePrompt?: string;
  options?: VideoGenerationOptions;
}

/**
 * Input for video generation (supports both text-to-video and image-to-video)
 */
export interface VideoGenerationInput {
  prompt: string;
  image?: string;
  negativePrompt?: string;
  options?: VideoGenerationOptions;
}

/**
 * Progress information during video generation
 */
export interface VideoGenerationProgress {
  status: VideoOperationStatus;
  progress: number;
  estimatedTimeRemaining?: number;
  message?: string;
}

/**
 * Video generation result metadata
 */
export interface VideoGenerationMetadata {
  duration: number;
  resolution: string;
  aspectRatio: string;
  model: string;
  operationName: string;
}

/**
 * Video generation result
 */
export interface VideoGenerationResult {
  videoUrl: string;
  metadata: VideoGenerationMetadata;
}

/**
 * Video generation error types
 */
export type VideoGenerationErrorType =
  | "QUOTA_EXCEEDED"
  | "POLICY_VIOLATION"
  | "TIMEOUT"
  | "NETWORK"
  | "INVALID_INPUT"
  | "OPERATION_FAILED";

/**
 * Video generation error
 */
export interface VideoGenerationError extends Error {
  type: VideoGenerationErrorType;
  statusCode?: number;
  retryable: boolean;
}

/**
 * Generated video from Veo API
 */
export interface VeoGeneratedVideo {
  video: {
    uri?: string;
    url?: string;
  };
}

/**
 * Operation response from Veo API
 */
export interface VeoOperation {
  name: string;
  done: boolean;
  metadata?: Record<string, unknown>;
  response?: {
    generatedVideos?: VeoGeneratedVideo[];
    candidates?: Array<{
      uri?: string;
      [key: string]: unknown;
    }>;
    generateVideoResponse?: {
      generatedSamples?: Array<{
        video?: {
          uri?: string;
        };
      }>;
    };
  };
  error?: {
    code: number;
    message: string;
    status: string;
  };
}
