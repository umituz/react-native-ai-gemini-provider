/**
 * Veo Polling Service
 * Handles polling logic for long-running video generation operations
 */

import { veoHttpClient } from "./veo-http-client.service";
import { downloadVideoFromVeo } from "./gemini-video-downloader";
import { extractVideoUrl } from "./gemini-video-url-extractor";
import { createVideoError } from "./gemini-video-error";
import type {
  VideoGenerationResult,
  VideoGenerationProgress,
  VeoOperation,
} from "../../domain/entities";

declare const __DEV__: boolean;

const POLL_INTERVAL = 10000;
const MAX_POLL_DURATION = 300000;
const MAX_POLL_ATTEMPTS = Math.floor(MAX_POLL_DURATION / POLL_INTERVAL);

/** Calculate polling progress (10-95% range) */
function calculateProgress(attempt: number, maxAttempts: number): number {
  return Math.round(10 + (attempt / maxAttempts) * 85);
}

class VeoPollingService {
  /**
   * Poll an operation until completion
   */
  async pollOperation(
    operationName: string,
    apiKey: string,
    model: string,
    onProgress?: (progress: VideoGenerationProgress) => void,
  ): Promise<VideoGenerationResult> {
    let attempts = 0;
    onProgress?.({ status: "processing", progress: 10 });

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[VeoPolling] Starting polling...", { operationName, maxAttempts: MAX_POLL_ATTEMPTS });
    }

    while (attempts < MAX_POLL_ATTEMPTS) {
      await this.delay(POLL_INTERVAL);
      attempts++;
      const progress = calculateProgress(attempts, MAX_POLL_ATTEMPTS);
      onProgress?.({ status: "processing", progress });

      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log("[VeoPolling] Poll attempt:", { attempts, progress });
      }

      const operation = await veoHttpClient.fetchOperationStatus(operationName, apiKey);

      if (operation.error) {
        if (typeof __DEV__ !== "undefined" && __DEV__) {
          // eslint-disable-next-line no-console
          console.error("[VeoPolling] Operation error:", operation.error);
        }
        throw createVideoError("OPERATION_FAILED", operation.error.message, operation.error.code);
      }

      if (operation.done) {
        if (typeof __DEV__ !== "undefined" && __DEV__) {
          // eslint-disable-next-line no-console
          console.log("[VeoPolling] Operation completed!");
        }

        return this.handleCompletedOperation(operation, apiKey, model, onProgress);
      }
    }

    throw createVideoError("TIMEOUT", `Operation timed out after ${MAX_POLL_DURATION / 1000}s`);
  }

  /**
   * Handle completed operation and download video
   */
  private async handleCompletedOperation(
    operation: VeoOperation,
    apiKey: string,
    model: string,
    onProgress?: (progress: VideoGenerationProgress) => void,
  ): Promise<VideoGenerationResult> {
    const rawVideoUrl = extractVideoUrl(operation);

    if (!rawVideoUrl) {
      throw createVideoError("OPERATION_FAILED", "No video URL in response");
    }

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[VeoPolling] Downloading video...");
    }

    const result = await downloadVideoFromVeo(rawVideoUrl, apiKey);
    onProgress?.({ status: "completed", progress: 100 });

    return {
      videoUrl: result.base64DataUri,
      metadata: {
        duration: 8,
        resolution: "720p",
        aspectRatio: "16:9",
        model,
        operationName: operation.name,
      },
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const veoPollingService = new VeoPollingService();
