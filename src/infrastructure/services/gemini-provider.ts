/**
 * Gemini Provider
 * Main AI provider implementation for Google Gemini
 * Implements IAIProvider for unified orchestration
 */

import type {
  IAIProvider,
  AIProviderConfig,
  JobSubmission,
  JobStatus,
  SubscribeOptions,
  ImageFeatureType,
  VideoFeatureType,
  ImageFeatureInputData,
  VideoFeatureInputData,
  ProviderCapabilities,
  RunOptions,
} from "@umituz/react-native-ai-generation-content";
import type {
  GeminiImageInput,
  GeminiImageGenerationResult,
} from "../../domain/entities";
import { geminiImageGenerationService } from "./gemini-image-generation.service";
import { geminiImageEditService } from "./gemini-image-edit.service";
import { providerInitializer, type GeminiProviderConfig } from "./provider-initializer";
import { jobProcessor } from "./job-processor";
import { generationExecutor } from "./generation-executor";
import {
  GEMINI_IMAGE_FEATURE_MODELS,
  GEMINI_VIDEO_FEATURE_MODELS,
} from "../../domain/constants/feature-models.constants";
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

export type { GeminiProviderConfig };

/**
 * Gemini provider capabilities
 */
const GEMINI_CAPABILITIES: ProviderCapabilities = {
  imageFeatures: [
    "upscale",
    "photo-restore",
    "face-swap",
    "anime-selfie",
    "remove-background",
    "remove-object",
    "hd-touch-up",
    "replace-background",
  ] as const,
  videoFeatures: ["ai-hug", "ai-kiss"] as const,
  textToImage: true,
  textToVideo: true,
  imageToVideo: true,
  textToVoice: false,
  textToText: true,
};

export class GeminiProvider implements IAIProvider {
  readonly providerId = "gemini";
  readonly providerName = "Google Gemini";

  initialize(config: AIProviderConfig): void {
    providerInitializer.initialize(config);
  }

  isInitialized(): boolean {
    return providerInitializer.isInitialized();
  }

  getCapabilities(): ProviderCapabilities {
    return GEMINI_CAPABILITIES;
  }

  isFeatureSupported(feature: ImageFeatureType | VideoFeatureType): boolean {
    const capabilities = this.getCapabilities();
    return (
      capabilities.imageFeatures.includes(feature as ImageFeatureType) ||
      capabilities.videoFeatures.includes(feature as VideoFeatureType)
    );
  }

  submitJob(model: string, input: Record<string, unknown>): Promise<JobSubmission> {
    return jobProcessor.submitJob(model, input);
  }

  getJobStatus(_model: string, requestId: string): Promise<JobStatus> {
    return jobProcessor.getJobStatus(_model, requestId);
  }

  getJobResult<T = unknown>(_model: string, requestId: string): Promise<T> {
    return jobProcessor.getJobResult<T>(_model, requestId);
  }

  async subscribe<T = unknown>(
    model: string,
    input: Record<string, unknown>,
    options?: SubscribeOptions<T>,
  ): Promise<T> {
    options?.onQueueUpdate?.({ status: "IN_QUEUE" });

    const result = await generationExecutor.executeGeneration<T>(model, input, {
      onProgress: (progress: number) => {
        options?.onProgress?.({ progress, status: "IN_PROGRESS" });
      },
    });

    options?.onProgress?.({ progress: 100, status: "COMPLETED" });
    options?.onQueueUpdate?.({ status: "COMPLETED" });
    options?.onResult?.(result);

    return result;
  }

  async run<T = unknown>(
    model: string,
    input: Record<string, unknown>,
    options?: RunOptions,
  ): Promise<T> {
    return generationExecutor.executeGeneration<T>(model, input, {
      onProgress: (progress: number) => {
        options?.onProgress?.({ progress, status: "IN_PROGRESS" });
      },
    });
  }

  async generateImage(prompt: string): Promise<GeminiImageGenerationResult> {
    return geminiImageGenerationService.generateImage(prompt);
  }

  async editImage(
    prompt: string,
    images: GeminiImageInput[],
  ): Promise<GeminiImageGenerationResult> {
    return geminiImageEditService.editImage(prompt, images);
  }

  async generateWithImages(
    model: string,
    prompt: string,
    images: GeminiImageInput[],
  ): Promise<{ text: string; response: unknown }> {
    return generationExecutor.generateWithImages(model, prompt, images);
  }

  reset(): void {
    providerInitializer.reset();
    jobProcessor.clear();
  }

  /**
   * Get model ID for an IMAGE feature
   */
  getImageFeatureModel(feature: ImageFeatureType): string {
    return GEMINI_IMAGE_FEATURE_MODELS[feature];
  }

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
   * Get model ID for a VIDEO feature
   */
  getVideoFeatureModel(feature: VideoFeatureType): string {
    return GEMINI_VIDEO_FEATURE_MODELS[feature];
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

export const geminiProviderService = new GeminiProvider();

export function createGeminiProvider(): GeminiProvider {
  return new GeminiProvider();
}
