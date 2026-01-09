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
import {
  providerInitializer,
  type GeminiProviderConfig,
} from "./provider-initializer";
import { jobProcessor } from "./job-processor";
import { generationExecutor } from "./generation-executor";
import { featureInputBuilder } from "./feature-input-builder";
import { featureModelSelector } from "./feature-model-selector";

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

  submitJob(
    model: string,
    input: Record<string, unknown>,
  ): Promise<JobSubmission> {
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
    return featureModelSelector.getImageFeatureModel(feature);
  }

  /**
   * Build input for an IMAGE feature
   */
  buildImageFeatureInput(
    feature: ImageFeatureType,
    data: ImageFeatureInputData,
  ): Record<string, unknown> {
    return featureInputBuilder.buildImageFeatureInput(feature, data);
  }

  /**
   * Get model ID for a VIDEO feature
   */
  getVideoFeatureModel(feature: VideoFeatureType): string {
    return featureModelSelector.getVideoFeatureModel(feature);
  }

  /**
   * Build input for a VIDEO feature
   */
  buildVideoFeatureInput(
    feature: VideoFeatureType,
    data: VideoFeatureInputData,
  ): Record<string, unknown> {
    return featureInputBuilder.buildVideoFeatureInput(feature, data);
  }
}

export const geminiProviderService = new GeminiProvider();

export function createGeminiProvider(): GeminiProvider {
  return new GeminiProvider();
}
