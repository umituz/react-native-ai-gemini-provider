/**
 * Gemini Video Generation Service
 * Orchestrates video generation using Google Veo REST API
 * @see https://ai.google.dev/gemini-api/docs/video
 */

import { geminiClientCoreService } from "./gemini-client-core.service";
import { geminiRetryService } from "./gemini-retry.service";
import { downloadVideoFromVeo } from "./gemini-video-downloader";
import { extractVideoUrl } from "./gemini-video-url-extractor";
import { createVideoError } from "./gemini-video-error";
import { DEFAULT_MODELS } from "../../domain/entities";
import type {
  VideoGenerationInput,
  VideoGenerationResult,
  VideoGenerationProgress,
  VeoOperation,
  TextToVideoInput,
} from "../../domain/entities";

declare const __DEV__: boolean;

const POLL_INTERVAL = 10000;
const MAX_POLL_DURATION = 300000;
const MAX_POLL_ATTEMPTS = Math.floor(MAX_POLL_DURATION / POLL_INTERVAL);
const VEO_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

/** Calculate polling progress (10-95% range) */
function calculateProgress(attempt: number, maxAttempts: number): number {
  return Math.round(10 + (attempt / maxAttempts) * 85);
}

class GeminiVideoGenerationService {
  async generateTextToVideo(
    input: TextToVideoInput,
    onProgress?: (progress: VideoGenerationProgress) => void,
  ): Promise<VideoGenerationResult> {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiVideoGeneration] generateTextToVideo() called", { prompt: input.prompt?.substring(0, 50) });
    }

    geminiClientCoreService.validateInitialization();
    this.validatePrompt(input.prompt);

    const config = geminiClientCoreService.getConfig();
    const model = config?.videoGenerationModel || DEFAULT_MODELS.VIDEO_GENERATION;
    const apiKey = config?.apiKey;
    if (!apiKey) throw createVideoError("INVALID_INPUT", "API key is required");

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiVideoGeneration] Starting operation with model:", model);
    }

    const operation = await this.startOperation(input, model, apiKey, onProgress);

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiVideoGeneration] Operation started:", operation.name);
    }

    return this.pollOperation(operation.name, apiKey, model, onProgress);
  }

  async generateVideo(
    input: VideoGenerationInput,
    onProgress?: (progress: VideoGenerationProgress) => void,
  ): Promise<VideoGenerationResult> {
    if (!input.image) return this.generateTextToVideo(input, onProgress);

    geminiClientCoreService.validateInitialization();
    this.validatePrompt(input.prompt);

    const config = geminiClientCoreService.getConfig();
    const model = config?.videoGenerationModel || DEFAULT_MODELS.VIDEO_GENERATION;
    const apiKey = config?.apiKey;
    if (!apiKey) throw createVideoError("INVALID_INPUT", "API key is required");

    const operation = await this.startImageToVideoOperation(input, model, apiKey, onProgress);
    return this.pollOperation(operation.name, apiKey, model, onProgress);
  }

  private async startOperation(
    input: TextToVideoInput,
    model: string,
    apiKey: string,
    onProgress?: (progress: VideoGenerationProgress) => void,
  ): Promise<VeoOperation> {
    const url = `${VEO_API_BASE}/models/${model}:predictLongRunning`;
    const body = {
      instances: [{ prompt: input.prompt }],
      parameters: {
        aspectRatio: input.options?.aspectRatio || "16:9",
        ...(input.negativePrompt && { negativePrompt: input.negativePrompt }),
      },
    };
    onProgress?.({ status: "queued", progress: 5 });
    return geminiRetryService.executeWithRetry(() => this.postRequest(url, body, apiKey));
  }

  private async startImageToVideoOperation(
    input: VideoGenerationInput,
    model: string,
    apiKey: string,
    onProgress?: (progress: VideoGenerationProgress) => void,
  ): Promise<VeoOperation> {
    const url = `${VEO_API_BASE}/models/${model}:predictLongRunning`;
    const body = {
      instances: [{ prompt: input.prompt, image: { bytesBase64Encoded: input.image } }],
      parameters: {
        aspectRatio: input.options?.aspectRatio || "16:9",
        ...(input.negativePrompt && { negativePrompt: input.negativePrompt }),
      },
    };
    onProgress?.({ status: "queued", progress: 5 });
    return geminiRetryService.executeWithRetry(() => this.postRequest(url, body, apiKey));
  }

  private async postRequest(url: string, body: Record<string, unknown>, apiKey: string): Promise<VeoOperation> {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw createVideoError("OPERATION_FAILED", `Veo API error: ${await res.text()}`, res.status);
    }
    return res.json() as Promise<VeoOperation>;
  }

  private async pollOperation(
    operationName: string,
    apiKey: string,
    model: string,
    onProgress?: (progress: VideoGenerationProgress) => void,
  ): Promise<VideoGenerationResult> {
    const url = `${VEO_API_BASE}/${operationName}`;
    let attempts = 0;
    onProgress?.({ status: "processing", progress: 10 });

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiVideoGeneration] Starting polling...", { operationName, maxAttempts: MAX_POLL_ATTEMPTS });
    }

    while (attempts < MAX_POLL_ATTEMPTS) {
      await this.delay(POLL_INTERVAL);
      attempts++;
      const progress = calculateProgress(attempts, MAX_POLL_ATTEMPTS);
      onProgress?.({ status: "processing", progress });

      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log("[GeminiVideoGeneration] Poll attempt:", { attempts, progress });
      }

      const operation = await this.fetchOperationStatus(url, apiKey);
      if (operation.error) {
        if (typeof __DEV__ !== "undefined" && __DEV__) {
          // eslint-disable-next-line no-console
          console.error("[GeminiVideoGeneration] Operation error:", operation.error);
        }
        throw createVideoError("OPERATION_FAILED", operation.error.message, operation.error.code);
      }
      if (operation.done) {
        if (typeof __DEV__ !== "undefined" && __DEV__) {
          // eslint-disable-next-line no-console
          console.log("[GeminiVideoGeneration] Operation completed!");
        }
        const rawVideoUrl = extractVideoUrl(operation);
        if (rawVideoUrl) {
          if (typeof __DEV__ !== "undefined" && __DEV__) {
            // eslint-disable-next-line no-console
            console.log("[GeminiVideoGeneration] Downloading video...");
          }
          const result = await downloadVideoFromVeo(rawVideoUrl, apiKey);
          onProgress?.({ status: "completed", progress: 100 });
          return {
            videoUrl: result.base64DataUri,
            metadata: { duration: 8, resolution: "720p", aspectRatio: "16:9", model, operationName },
          };
        }
      }
    }
    throw createVideoError("TIMEOUT", `Operation timed out after ${MAX_POLL_DURATION / 1000}s`);
  }

  private async fetchOperationStatus(url: string, apiKey: string): Promise<VeoOperation> {
    return geminiRetryService.executeWithRetry(async () => {
      const res = await fetch(url, { method: "GET", headers: { "x-goog-api-key": apiKey } });
      if (!res.ok) throw createVideoError("NETWORK", `Polling error: ${await res.text()}`, res.status);
      return res.json() as Promise<VeoOperation>;
    });
  }

  private validatePrompt(prompt: string): void {
    if (!prompt?.trim()) throw createVideoError("INVALID_INPUT", "Prompt is required");
    if (prompt.length > 2000) throw createVideoError("INVALID_INPUT", "Prompt exceeds 2000 characters");
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const geminiVideoGenerationService = new GeminiVideoGenerationService();
