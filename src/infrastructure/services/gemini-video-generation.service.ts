/**
 * Gemini Video Generation Service
 * Orchestrates video generation using Google Veo REST API
 * @see https://ai.google.dev/gemini-api/docs/video
 */

import { geminiClientCoreService } from "./gemini-client-core.service";
import { geminiRetryService } from "./gemini-retry.service";
import { veoHttpClient } from "./veo-http-client.service";
import { veoPollingService } from "./veo-polling.service";
import { createVideoError } from "./gemini-video-error";
import { DEFAULT_MODELS } from "../../domain/entities";
import type {
  VideoGenerationInput,
  VideoGenerationResult,
  VideoGenerationProgress,
  TextToVideoInput,
} from "../../domain/entities";

declare const __DEV__: boolean;

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

    const instances = [{ prompt: input.prompt }];
    const parameters = {
      aspectRatio: input.options?.aspectRatio || "16:9",
      ...(input.negativePrompt && { negativePrompt: input.negativePrompt }),
    };

    onProgress?.({ status: "queued", progress: 5 });

    const operation = await geminiRetryService.executeWithRetry(() =>
      veoHttpClient.startOperation(model, apiKey, instances, parameters),
    );

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiVideoGeneration] Operation started:", operation.name);
    }

    return veoPollingService.pollOperation(operation.name, apiKey, model, onProgress);
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

    const instances = [{
      prompt: input.prompt,
      image: { bytesBase64Encoded: input.image },
    }];
    const parameters = {
      aspectRatio: input.options?.aspectRatio || "16:9",
      ...(input.negativePrompt && { negativePrompt: input.negativePrompt }),
    };

    onProgress?.({ status: "queued", progress: 5 });

    const operation = await geminiRetryService.executeWithRetry(() =>
      veoHttpClient.startOperation(model, apiKey, instances, parameters),
    );

    return veoPollingService.pollOperation(operation.name, apiKey, model, onProgress);
  }

  private validatePrompt(prompt: string): void {
    if (!prompt?.trim()) throw createVideoError("INVALID_INPUT", "Prompt is required");
    if (prompt.length > 2000) throw createVideoError("INVALID_INPUT", "Prompt exceeds 2000 characters");
  }
}

export const geminiVideoGenerationService = new GeminiVideoGenerationService();
