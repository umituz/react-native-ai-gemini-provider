/**
 * Gemini Video Generation Service
 * Handles video generation using Google Veo REST API (predictLongRunning)
 * @see https://ai.google.dev/gemini-api/docs/video
 */

import { calculatePollingProgress } from "@umituz/react-native-ai-generation-content";
import { geminiClientCoreService } from "./gemini-client-core.service";
import { geminiRetryService } from "./gemini-retry.service";
import { DEFAULT_MODELS } from "../../domain/entities";
import type {
  VideoGenerationInput,
  VideoGenerationResult,
  VideoGenerationProgress,
  VeoOperation,
  VideoGenerationError,
  TextToVideoInput,
} from "../../domain/entities";

declare const __DEV__: boolean;

const DEFAULT_POLL_INTERVAL = 10000; // 10 seconds
const MAX_POLL_DURATION = 300000; // 5 minutes
const MAX_POLL_ATTEMPTS = Math.floor(MAX_POLL_DURATION / DEFAULT_POLL_INTERVAL);
const VEO_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

class GeminiVideoGenerationService {
  /**
   * Generate video from text prompt using Veo REST API (text-to-video)
   * Uses predictLongRunning endpoint with instances/parameters format
   */
  async generateTextToVideo(
    input: TextToVideoInput,
    onProgress?: (progress: VideoGenerationProgress) => void,
  ): Promise<VideoGenerationResult> {
    geminiClientCoreService.validateInitialization();
    this.validateTextInput(input);

    const config = geminiClientCoreService.getConfig();
    const videoModel = config?.videoGenerationModel || DEFAULT_MODELS.VIDEO_GENERATION;
    const apiKey = config?.apiKey;

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiVideoGeneration] generateTextToVideo() called", {
        model: videoModel,
        promptLength: input.prompt.length,
      });
    }

    // REST API uses predictLongRunning endpoint
    const url = `${VEO_API_BASE}/models/${videoModel}:predictLongRunning`;

    // REST API format: instances array with parameters object
    const requestBody = {
      instances: [{ prompt: input.prompt }],
      parameters: {
        aspectRatio: input.options?.aspectRatio || "16:9",
        ...(input.negativePrompt && { negativePrompt: input.negativePrompt }),
      },
    };

    onProgress?.({ status: "queued", progress: 5 });

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiVideoGeneration] Request URL:", url);
      // eslint-disable-next-line no-console
      console.log("[GeminiVideoGeneration] Request body:", JSON.stringify(requestBody, null, 2));
    }

    const operation = await geminiRetryService.executeWithRetry(async () => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey!,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw this.createError("OPERATION_FAILED", `Veo API error (${res.status}): ${errorText}`, res.status);
      }

      return res.json() as Promise<VeoOperation>;
    });

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiVideoGeneration] Operation started", {
        operationName: operation.name,
      });
    }

    onProgress?.({ status: "processing", progress: 10 });

    return this.pollOperation(operation.name, apiKey!, videoModel, onProgress);
  }

  /**
   * Generate video from image and prompt using Veo REST API (image-to-video)
   * Uses predictLongRunning endpoint with image in instances
   */
  async generateVideo(
    input: VideoGenerationInput,
    onProgress?: (progress: VideoGenerationProgress) => void,
  ): Promise<VideoGenerationResult> {
    // If no image provided, use text-to-video
    if (!input.image) {
      return this.generateTextToVideo(input, onProgress);
    }

    geminiClientCoreService.validateInitialization();
    this.validateInput(input);

    const config = geminiClientCoreService.getConfig();
    const videoModel = config?.videoGenerationModel || DEFAULT_MODELS.VIDEO_GENERATION;
    const apiKey = config?.apiKey;

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiVideoGeneration] generateVideo() called", {
        model: videoModel,
        promptLength: input.prompt.length,
        hasImage: !!input.image,
      });
    }

    // REST API uses predictLongRunning endpoint
    const url = `${VEO_API_BASE}/models/${videoModel}:predictLongRunning`;

    // REST API format with image for image-to-video
    const requestBody = {
      instances: [{
        prompt: input.prompt,
        image: {
          bytesBase64Encoded: input.image,
        },
      }],
      parameters: {
        aspectRatio: input.options?.aspectRatio || "16:9",
        ...(input.negativePrompt && { negativePrompt: input.negativePrompt }),
      },
    };

    onProgress?.({ status: "queued", progress: 5 });

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiVideoGeneration] Request URL:", url);
    }

    const operation = await geminiRetryService.executeWithRetry(async () => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey!,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw this.createError("OPERATION_FAILED", `Veo API error (${res.status}): ${errorText}`, res.status);
      }

      return res.json() as Promise<VeoOperation>;
    });

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiVideoGeneration] Operation started", {
        operationName: operation.name,
      });
    }

    onProgress?.({ status: "processing", progress: 10 });

    return this.pollOperation(operation.name, apiKey!, videoModel, onProgress);
  }

  /**
   * Poll operation status until completion
   */
  private async pollOperation(
    operationName: string,
    apiKey: string,
    model: string,
    onProgress?: (progress: VideoGenerationProgress) => void,
  ): Promise<VideoGenerationResult> {
    const url = `${VEO_API_BASE}/${operationName}`;
    let attempts = 0;

    while (attempts < MAX_POLL_ATTEMPTS) {
      await this.delay(DEFAULT_POLL_INTERVAL);
      attempts++;

      const progress = calculatePollingProgress(attempts, MAX_POLL_ATTEMPTS);

      onProgress?.({
        status: "processing",
        progress,
        estimatedTimeRemaining: (MAX_POLL_ATTEMPTS - attempts) * (DEFAULT_POLL_INTERVAL / 1000),
      });

      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log("[GeminiVideoGeneration] Polling operation", {
          attempt: attempts,
          progress: `${progress.toFixed(0)}%`,
        });
      }

      const operation = await geminiRetryService.executeWithRetry(async () => {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "x-goog-api-key": apiKey,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw this.createError("NETWORK", `Polling error (${res.status}): ${errorText}`, res.status);
        }

        return res.json() as Promise<VeoOperation>;
      });

      if (operation.error) {
        throw this.createError("OPERATION_FAILED", operation.error.message, operation.error.code);
      }

      if (operation.done) {
        const videoUrl = this.extractVideoUrl(operation);

        if (videoUrl) {
          onProgress?.({ status: "completed", progress: 100 });

          return {
            videoUrl,
            metadata: {
              duration: 8,
              resolution: "720p",
              aspectRatio: "16:9",
              model,
              operationName,
            },
          };
        }
      }
    }

    throw this.createError("TIMEOUT", `Operation timed out after ${MAX_POLL_DURATION / 1000} seconds`);
  }

  /**
   * Extract video URL from operation response (handles multiple response formats)
   */
  private extractVideoUrl(operation: VeoOperation): string | null {
    const response = operation.response;
    if (!response) return null;

    // Format 1: generatedVideos[].video.uri (new SDK format)
    if (response.generatedVideos?.[0]?.video?.uri) {
      return response.generatedVideos[0].video.uri;
    }

    // Format 2: generatedVideos[].video.url
    if (response.generatedVideos?.[0]?.video?.url) {
      return response.generatedVideos[0].video.url;
    }

    // Format 3: candidates[].uri (legacy format)
    if (response.candidates?.[0]?.uri) {
      return response.candidates[0].uri;
    }

    // Format 4: generateVideoResponse.generatedSamples[].video.uri (REST API format)
    if (response.generateVideoResponse?.generatedSamples?.[0]?.video?.uri) {
      return response.generateVideoResponse.generatedSamples[0].video.uri;
    }

    return null;
  }

  /**
   * Validate text-to-video input parameters
   */
  private validateTextInput(input: TextToVideoInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw this.createError("INVALID_INPUT", "Prompt is required");
    }

    if (input.prompt.length > 2000) {
      throw this.createError("INVALID_INPUT", "Prompt exceeds 2000 characters");
    }
  }

  /**
   * Validate image-to-video input parameters
   */
  private validateInput(input: VideoGenerationInput): void {
    this.validateTextInput(input);

    if (!input.image || input.image.length === 0) {
      throw this.createError("INVALID_INPUT", "Image is required for image-to-video");
    }
  }

  /**
   * Create typed error
   */
  private createError(
    type: VideoGenerationError["type"],
    message: string,
    statusCode?: number,
  ): VideoGenerationError {
    const error = new Error(message) as VideoGenerationError;
    error.type = type;
    error.statusCode = statusCode;
    error.retryable = type === "NETWORK" || type === "TIMEOUT";
    return error;
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const geminiVideoGenerationService = new GeminiVideoGenerationService();
