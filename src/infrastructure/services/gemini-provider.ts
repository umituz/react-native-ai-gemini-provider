/**
 * Gemini Provider
 * Main AI provider implementation for Google Gemini
 */

import type {
  GeminiImageInput,
  GeminiImageGenerationResult,
} from "../../domain/entities";
import { geminiImageGenerationService } from "./gemini-image-generation.service";
import { geminiImageEditService } from "./gemini-image-edit.service";
import { providerInitializer, type AIProviderConfig } from "./provider-initializer";
import { jobProcessor } from "./job-processor";
import { generationExecutor } from "./generation-executor";
import type { JobSubmission, JobStatus } from "../job/JobManager";

export type { AIProviderConfig, JobSubmission, JobStatus };

export interface SubscribeOptions<T = unknown> {
  timeoutMs?: number;
  onQueueUpdate?: (status: JobStatus) => void;
  onProgress?: (progress: number) => void;
  onResult?: (result: T) => void;
}

export class GeminiProvider {
  readonly providerId = "gemini";
  readonly providerName = "Google Gemini";

  initialize(config: AIProviderConfig): void {
    providerInitializer.initialize(config);
  }

  isInitialized(): boolean {
    return providerInitializer.isInitialized();
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
    options?.onProgress?.(10);

    const result = await generationExecutor.executeGeneration<T>(model, input);

    options?.onProgress?.(100);
    options?.onQueueUpdate?.({ status: "COMPLETED" });
    options?.onResult?.(result);

    return result;
  }

  async run<T = unknown>(
    model: string,
    input: Record<string, unknown>,
  ): Promise<T> {
    return generationExecutor.executeGeneration<T>(model, input);
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
}

export const geminiProviderService = new GeminiProvider();

export function createGeminiProvider(): GeminiProvider {
  return new GeminiProvider();
}
