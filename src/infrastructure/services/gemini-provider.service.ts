/**
 * Gemini Provider Service
 * IAIProvider implementation for Google Gemini
 */

import type {
  GeminiConfig,
  GeminiContent,
  GeminiImageInput,
  GeminiImageGenerationResult,
} from "../../domain/entities";
import { geminiClientCoreService } from "./gemini-client-core.service";
import { geminiTextGenerationService } from "./gemini-text-generation.service";
import { geminiImageGenerationService } from "./gemini-image-generation.service";
import { geminiImageEditService } from "./gemini-image-edit.service";
import { extractBase64Data } from "../utils/gemini-data-transformer.util";

declare const __DEV__: boolean;

export interface AIProviderConfig {
  apiKey: string;
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  defaultTimeoutMs?: number;
  /** Model used for image generation */
  imageModel?: string;
}

export interface JobSubmission {
  requestId: string;
  statusUrl?: string;
  responseUrl?: string;
}

export interface JobStatus {
  status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  logs?: Array<{ message: string; level: string; timestamp?: string }>;
  queuePosition?: number;
  eta?: number;
}

export interface SubscribeOptions<T = unknown> {
  timeoutMs?: number;
  onQueueUpdate?: (status: JobStatus) => void;
  onProgress?: (progress: number) => void;
  onResult?: (result: T) => void;
}

interface PendingJob {
  model: string;
  input: Record<string, unknown>;
  status: JobStatus["status"];
  result?: unknown;
  error?: string;
}

class GeminiProviderService {
  readonly providerId = "gemini";
  readonly providerName = "Google Gemini";

  private pendingJobs: Map<string, PendingJob> = new Map();
  private jobCounter = 0;

  initialize(config: AIProviderConfig): void {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiProvider] initialize() called", {
        hasApiKey: !!config.apiKey,
        imageModel: config.imageModel,
      });
    }

    const geminiConfig: GeminiConfig = {
      apiKey: config.apiKey,
      maxRetries: config.maxRetries,
      baseDelay: config.baseDelay,
      maxDelay: config.maxDelay,
      defaultTimeoutMs: config.defaultTimeoutMs,
      imageModel: config.imageModel,
    };

    geminiClientCoreService.initialize(geminiConfig);

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiProvider] initialized successfully");
    }
  }

  isInitialized(): boolean {
    return geminiClientCoreService.isInitialized();
  }

  submitJob(
    model: string,
    input: Record<string, unknown>,
  ): Promise<JobSubmission> {
    const requestId = this.generateRequestId();

    this.pendingJobs.set(requestId, {
      model,
      input,
      status: "IN_QUEUE",
    });

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiProvider] Job submitted:", { requestId, model });
    }

    this.processJobAsync(requestId).catch((error) => {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.error("[GeminiProvider] Job failed:", error);
      }
    });

    return Promise.resolve({
      requestId,
      statusUrl: undefined,
      responseUrl: undefined,
    });
  }

  getJobStatus(_model: string, requestId: string): Promise<JobStatus> {
    const job = this.pendingJobs.get(requestId);

    if (!job) {
      return Promise.resolve({ status: "FAILED" });
    }

    return Promise.resolve({ status: job.status });
  }

  getJobResult<T = unknown>(_model: string, requestId: string): Promise<T> {
    const job = this.pendingJobs.get(requestId);

    if (!job) {
      return Promise.reject(new Error(`Job ${requestId} not found`));
    }

    if (job.status !== "COMPLETED") {
      return Promise.reject(new Error(`Job ${requestId} not completed`));
    }

    if (job.error) {
      return Promise.reject(new Error(job.error));
    }

    this.pendingJobs.delete(requestId);

    return Promise.resolve(job.result as T);
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
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiProvider] Run started:", {
        model,
        hasPrompt: !!input.prompt,
        outputFormat: input.outputFormat,
      });
    }

    const result = await this.executeGeneration<T>(model, input);

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiProvider] Run completed:", {
        model,
        hasResult: !!result,
      });
    }

    return result;
  }

  /**
   * Generate image from text only (Imagen API)
   * Use for text-to-image generation without input images
   */
  async generateImage(
    prompt: string,
  ): Promise<GeminiImageGenerationResult> {
    return geminiImageGenerationService.generateImage(prompt);
  }

  /**
   * Edit/transform image using input image + prompt (Gemini API)
   * Use for image editing, transformation, style transfer
   */
  async editImage(
    prompt: string,
    images: GeminiImageInput[],
  ): Promise<GeminiImageGenerationResult> {
    return geminiImageEditService.editImage(prompt, images);
  }

  /**
   * Generate content with images (multimodal)
   */
  async generateWithImages(
    model: string,
    prompt: string,
    images: GeminiImageInput[],
  ): Promise<{ text: string; response: unknown }> {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiProvider] generateWithImages() called", {
        model,
        promptLength: prompt.length,
        imagesCount: images.length,
      });
    }

    const response = await geminiTextGenerationService.generateWithImages(
      model,
      prompt,
      images,
    );

    const text = response.candidates?.[0]?.content.parts
      .filter((p): p is { text: string } => "text" in p)
      .map((p) => p.text)
      .join("") || "";

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiProvider] generateWithImages() completed", {
        hasText: !!text,
        textLength: text.length,
      });
    }

    return { text, response };
  }

  reset(): void {
    geminiClientCoreService.reset();
    this.pendingJobs.clear();
    this.jobCounter = 0;
  }

  private generateRequestId(): string {
    this.jobCounter++;
    return `gemini-${Date.now()}-${this.jobCounter}`;
  }

  private async processJobAsync(requestId: string): Promise<void> {
    const job = this.pendingJobs.get(requestId);

    if (!job) return;

    job.status = "IN_PROGRESS";

    try {
      const result = await this.executeGeneration(job.model, job.input);
      job.result = result;
      job.status = "COMPLETED";
    } catch (error) {
      job.status = "FAILED";
      job.error = error instanceof Error ? error.message : String(error);
    }
  }

  private async executeGeneration<T>(
    model: string,
    input: Record<string, unknown>,
  ): Promise<T> {
    const isImageGeneration = input.generateImage === true || input.type === "image";

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiProvider] Execute generation:", {
        model,
        isImageGeneration,
        promptLength: String(input.prompt || "").length,
      });
    }

    if (isImageGeneration) {
      const prompt = String(input.prompt || "");
      const images = input.images as GeminiImageInput[] | undefined;
      const result = await geminiImageGenerationService.generateImage(prompt, images);
      return result as T;
    }

    const contents = this.buildContents(input);
    const response = await geminiTextGenerationService.generateContent(
      model,
      contents,
      input.generationConfig as undefined,
    );

    return this.formatResponse<T>(response, input);
  }

  private buildContents(input: Record<string, unknown>): GeminiContent[] {
    const contents: GeminiContent[] = [];

    if (typeof input.prompt === "string") {
      const parts: GeminiContent["parts"] = [{ text: input.prompt }];

      // Handle single image
      if (input.image_url && typeof input.image_url === "string") {
        const imageData = this.parseImageUrl(input.image_url);
        if (imageData) {
          parts.push({ inlineData: imageData });
        }
      }

      // Handle multiple images
      if (Array.isArray(input.images)) {
        for (const img of input.images as GeminiImageInput[]) {
          parts.push({
            inlineData: {
              mimeType: img.mimeType,
              data: extractBase64Data(img.base64),
            },
          });
        }
      }

      contents.push({ parts, role: "user" });
    }

    if (Array.isArray(input.contents)) {
      contents.push(...(input.contents as GeminiContent[]));
    }

    return contents;
  }

  private parseImageUrl(
    imageUrl: string,
  ): { mimeType: string; data: string } | null {
    const base64Match = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (base64Match) {
      return {
        mimeType: base64Match[1],
        data: base64Match[2],
      };
    }
    return null;
  }

  private formatResponse<T>(
    response: unknown,
    input: Record<string, unknown>,
  ): T {
    const resp = response as {
      candidates?: Array<{
        content: {
          parts: Array<{
            text?: string;
            inlineData?: { mimeType: string; data: string };
          }>;
        };
      }>;
    };

    const candidate = resp.candidates?.[0];
    const parts = candidate?.content.parts || [];

    // Extract text
    const text = parts.find((p) => p.text)?.text;

    // Extract image if present
    const imagePart = parts.find((p) => p.inlineData);
    const imageData = imagePart?.inlineData;

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiProvider] Format response:", {
        hasText: !!text,
        textLength: text?.length ?? 0,
        hasImage: !!imageData,
        outputFormat: input.outputFormat,
      });
    }

    // Build result object - always return { text } for consistency
    const result: Record<string, unknown> = {
      text,
      response,
    };

    if (imageData) {
      result.imageUrl = `data:${imageData.mimeType};base64,${imageData.data}`;
      result.imageBase64 = imageData.data;
      result.mimeType = imageData.mimeType;
    }

    return result as T;
  }
}

export const geminiProviderService = new GeminiProviderService();

/**
 * Factory function to create a new Gemini provider instance
 */
export function createGeminiProvider(): GeminiProviderService {
  return new GeminiProviderService();
}
