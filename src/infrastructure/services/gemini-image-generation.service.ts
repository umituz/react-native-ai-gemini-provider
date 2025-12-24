/**
 * Gemini Image Generation Service
 * Handles image generation using Imagen API
 */

import { geminiClientCoreService } from "./gemini-client-core.service";
import { geminiRetryService } from "./gemini-retry.service";
import { DEFAULT_MODELS } from "../../domain/entities";
import type {
  GeminiGenerationConfig,
  GeminiImageGenerationResult,
} from "../../domain/entities";

declare const __DEV__: boolean;

interface ImagenApiResponse {
  generatedImages?: Array<{
    image?: {
      imageBytes?: string;
    };
  }>;
}

class GeminiImageGenerationService {
  /**
   * Generate image from prompt using Imagen API
   * Uses REST API endpoint: /v1beta/models/{model}:predict
   */
  async generateImage(
    prompt: string,
    _images?: Array<{ base64: string; mimeType: string }>,
    _config?: GeminiGenerationConfig,
  ): Promise<GeminiImageGenerationResult> {
    geminiClientCoreService.validateInitialization();

    const config = geminiClientCoreService.getConfig();
    const imageModel = config?.textToImageModel || DEFAULT_MODELS.TEXT_TO_IMAGE;
    const apiKey = config?.apiKey;

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiClient] generateImage() called (Imagen API)", {
        model: imageModel,
        promptLength: prompt.length,
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${imageModel}:predict`;

    const requestBody = {
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1",
      },
    };

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiClient] Imagen API request", {
        url,
        prompt: prompt.substring(0, 100) + "...",
      });
    }

    const response = await geminiRetryService.executeWithRetry(async () => {
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
        throw new Error(`Imagen API error (${res.status}): ${errorText}`);
      }

      return res.json() as Promise<ImagenApiResponse>;
    });

    const result: GeminiImageGenerationResult = {
      text: undefined,
      imageUrl: undefined,
      imageBase64: undefined,
      mimeType: "image/png",
    };

    if (response.generatedImages && response.generatedImages.length > 0) {
      const generatedImage = response.generatedImages[0];
      const imageBytes = generatedImage.image?.imageBytes;

      if (imageBytes) {
        result.imageBase64 = imageBytes;
        result.imageUrl = `data:image/png;base64,${imageBytes}`;
      }
    }

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiClient] generateImage() completed (Imagen)", {
        hasImage: !!result.imageBase64,
        imageDataLength: result.imageBase64?.length ?? 0,
      });
    }

    return result;
  }
}

export const geminiImageGenerationService = new GeminiImageGenerationService();
