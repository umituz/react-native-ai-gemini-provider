/**
 * Gemini Provider
 * Main AI provider implementation for Google Gemini
 */

import type {
  GeminiConfig,
  GeminiImageInput,
  GeminiImageGenerationResult,
} from "../../domain/entities";
import { geminiClientCoreService } from "./gemini-client-core.service";
import { geminiTextGenerationService } from "./gemini-text-generation.service";
import { geminiImageGenerationService } from "./gemini-image-generation.service";
import { geminiImageEditService } from "./gemini-image-edit.service";
import { JobManager } from "../job/JobManager";
import { ContentBuilder } from "../content/ContentBuilder";
import { ResponseFormatter } from "../response/ResponseFormatter";
import type { JobSubmission, JobStatus } from "../job/JobManager";

declare const __DEV__: boolean;

export interface AIProviderConfig {
  apiKey: string;
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  defaultTimeoutMs?: number;
  textModel?: string;
  textToImageModel?: string;
  imageEditModel?: string;
}

export interface SubscribeOptions<T = unknown> {
  timeoutMs?: number;
  onQueueUpdate?: (status: JobStatus) => void;
  onProgress?: (progress: number) => void;
  onResult?: (result: T) => void;
}

export class GeminiProvider {
  readonly providerId = "gemini";
  readonly providerName = "Google Gemini";

  private jobManager = new JobManager();
  private contentBuilder = new ContentBuilder();
  private responseFormatter = new ResponseFormatter();

  initialize(config: AIProviderConfig): void {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiProvider] Initializing...");
    }

    const geminiConfig: GeminiConfig = {
      apiKey: config.apiKey,
      maxRetries: config.maxRetries,
      baseDelay: config.baseDelay,
      maxDelay: config.maxDelay,
      defaultTimeoutMs: config.defaultTimeoutMs,
      textModel: config.textModel,
      textToImageModel: config.textToImageModel,
      imageEditModel: config.imageEditModel,
    };

    geminiClientCoreService.initialize(geminiConfig);
  }

  isInitialized(): boolean {
    return geminiClientCoreService.isInitialized();
  }

  submitJob(model: string, input: Record<string, unknown>): Promise<JobSubmission> {
    const submission = this.jobManager.submitJob(model, input);

    this.processJobAsync(submission.requestId).catch((error) => {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.error("[GeminiProvider] Job failed:", error);
      }
    });

    return Promise.resolve(submission);
  }

  getJobStatus(_model: string, requestId: string): Promise<JobStatus> {
    const status = this.jobManager.getJobStatus(requestId);
    return Promise.resolve(status);
  }

  getJobResult<T = unknown>(_model: string, requestId: string): Promise<T> {
    try {
      const result = this.jobManager.getJobResult<T>(requestId);
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async subscribe<T = unknown>(
    model: string,
    input: Record<string, unknown>,
    options?: SubscribeOptions<T>,
  ): Promise<T> {
    options?.onQueueUpdate?.({ status: "IN_QUEUE" });
    options?.onProgress?.(10);

    const result = await this.executeGeneration<T>(model, input);

    options?.onProgress?.(100);
    options?.onQueueUpdate?.({ status: "COMPLETED" });
    options?.onResult?.(result);

    return result;
  }

  async run<T = unknown>(
    model: string,
    input: Record<string, unknown>,
  ): Promise<T> {
    return this.executeGeneration<T>(model, input);
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
    const response = await geminiTextGenerationService.generateWithImages(
      model,
      prompt,
      images,
    );

    const text = response.candidates?.[0]?.content.parts
      .filter((p): p is { text: string } => "text" in p)
      .map((p) => p.text)
      .join("") || "";

    return { text, response };
  }

  reset(): void {
    geminiClientCoreService.reset();
    this.jobManager.clear();
  }

  private async processJobAsync(requestId: string): Promise<void> {
    const job = this.jobManager.getJob(requestId);
    if (!job) return;

    this.jobManager.updateJobStatus(requestId, "IN_PROGRESS");

    try {
      const result = await this.executeGeneration(job.model, job.input);
      this.jobManager.setJobResult(requestId, result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.jobManager.setJobError(requestId, errorMessage);
    }
  }

  private async executeGeneration<T>(
    model: string,
    input: Record<string, unknown>,
  ): Promise<T> {
    const isImageGeneration = input.generateImage === true || input.type === "image";

    if (isImageGeneration) {
      const prompt = String(input.prompt || "");
      const images = input.images as GeminiImageInput[] | undefined;
      const result = await geminiImageGenerationService.generateImage(prompt, images);
      return result as T;
    }

    const contents = this.contentBuilder.buildContents(input);
    const response = await geminiTextGenerationService.generateContent(
      model,
      contents,
      input.generationConfig as undefined,
    );

    return this.responseFormatter.formatResponse<T>(response, input);
  }
}

export const geminiProviderService = new GeminiProvider();

export function createGeminiProvider(): GeminiProvider {
  return new GeminiProvider();
}
