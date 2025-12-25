/**
 * Gemini Video Generation Service
 * Handles video generation using Google Veo API
 */

import { geminiClientCoreService } from "./gemini-client-core.service";
import { geminiRetryService } from "./gemini-retry.service";
import { DEFAULT_MODELS, RESPONSE_MODALITIES } from "../../domain/entities";
import type {
  VideoGenerationInput,
  VideoGenerationResult,
  VideoGenerationProgress,
  VeoOperation,
  VideoGenerationError,
} from "../../domain/entities";

declare const __DEV__: boolean;

const DEFAULT_POLL_INTERVAL = 10000; // 10 seconds
const MAX_POLL_DURATION = 300000; // 5 minutes
const MAX_POLL_ATTEMPTS = Math.floor(MAX_POLL_DURATION / DEFAULT_POLL_INTERVAL);

class GeminiVideoGenerationService {
  /**
   * Generate video from image and prompt using Veo API
   */
  async generateVideo(
    input: VideoGenerationInput,
    onProgress?: (progress: VideoGenerationProgress) => void,
  ): Promise<VideoGenerationResult> {
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
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/${videoModel}:generate`;

    const requestBody = {
      model: videoModel,
      contents: [
        {
          parts: [
            { text: input.prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: input.image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: RESPONSE_MODALITIES.VIDEO_ONLY,
        videoGenerationConfig: {
          numberOfVideos: input.options?.numberOfVideos || 1,
          aspectRatio: input.options?.aspectRatio || "9:16",
          resolution: input.options?.resolution || "720p",
        },
      },
    };

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

    const result = await this.pollOperation(operation.name, apiKey!, onProgress);

    return result;
  }

  /**
   * Poll operation status until completion
   */
  private async pollOperation(
    operationName: string,
    apiKey: string,
    onProgress?: (progress: VideoGenerationProgress) => void,
  ): Promise<VideoGenerationResult> {
    const url = `https://generativelanguage.googleapis.com/v1/${operationName}`;
    let attempts = 0;

    while (attempts < MAX_POLL_ATTEMPTS) {
      await this.delay(DEFAULT_POLL_INTERVAL);
      attempts++;

      const progress = Math.min(95, (attempts / MAX_POLL_ATTEMPTS) * 100);

      if (onProgress) {
        onProgress({
          status: "processing",
          progress,
          estimatedTimeRemaining: (MAX_POLL_ATTEMPTS - attempts) * (DEFAULT_POLL_INTERVAL / 1000),
        });
      }

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
        throw this.createError(
          "OPERATION_FAILED",
          operation.error.message,
          operation.error.code,
        );
      }

      if (operation.done && operation.response?.candidates?.[0]?.uri) {
        const videoUrl = operation.response.candidates[0].uri;

        if (onProgress) {
          onProgress({
            status: "completed",
            progress: 100,
          });
        }

        return {
          videoUrl,
          metadata: {
            duration: 10,
            resolution: "720p",
            aspectRatio: "9:16",
            model: DEFAULT_MODELS.VIDEO_GENERATION,
            operationName,
          },
        };
      }
    }

    throw this.createError("TIMEOUT", `Operation timed out after ${MAX_POLL_DURATION / 1000} seconds`);
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: VideoGenerationInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw this.createError("INVALID_INPUT", "Prompt is required");
    }

    if (input.prompt.length > 2000) {
      throw this.createError("INVALID_INPUT", "Prompt exceeds 2000 characters");
    }

    if (!input.image || input.image.length === 0) {
      throw this.createError("INVALID_INPUT", "Image is required");
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
