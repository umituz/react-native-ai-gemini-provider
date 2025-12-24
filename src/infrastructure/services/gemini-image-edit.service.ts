/**
 * Gemini Image Edit Service
 * Handles image editing/transformation using Gemini API
 */

import { geminiClientCoreService } from "./gemini-client-core.service";
import { geminiRetryService } from "./gemini-retry.service";
import { extractBase64Data } from "../utils/gemini-data-transformer.util";
import { DEFAULT_MODELS } from "../../domain/entities";
import type { GeminiImageGenerationResult } from "../../domain/entities";

declare const __DEV__: boolean;

interface GeminiContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inlineData?: {
          data?: string;
          mimeType?: string;
        };
      }>;
    };
  }>;
}

class GeminiImageEditService {
  /**
   * Edit/transform image using Gemini generateContent API
   * Takes input image + prompt and generates new image
   */
  async editImage(
    prompt: string,
    images: Array<{ base64: string; mimeType: string }>,
  ): Promise<GeminiImageGenerationResult> {
    geminiClientCoreService.validateInitialization();

    const config = geminiClientCoreService.getConfig();
    const editModel = config?.imageEditModel || DEFAULT_MODELS.IMAGE_EDIT;
    const apiKey = config?.apiKey;

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiClient] editImage() called", {
        model: editModel,
        promptLength: prompt.length,
        imagesCount: images.length,
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${editModel}:generateContent`;

    const parts: Array<Record<string, unknown>> = [];

    for (const image of images) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: extractBase64Data(image.base64),
        },
      });
    }

    parts.push({ text: prompt });

    const requestBody = {
      contents: [{ parts }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    };

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiClient] editImage() request", {
        url,
        partsCount: parts.length,
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
        throw new Error(`Image edit API error (${res.status}): ${errorText}`);
      }

      return res.json() as Promise<GeminiContentResponse>;
    });

    const result: GeminiImageGenerationResult = {
      text: undefined,
      imageUrl: undefined,
      imageBase64: undefined,
      mimeType: "image/png",
    };

    const candidate = response.candidates?.[0];
    const responseParts = candidate?.content?.parts || [];

    for (const part of responseParts) {
      if (part.text) {
        result.text = part.text;
      }
      if (part.inlineData) {
        result.imageBase64 = part.inlineData.data;
        result.mimeType = part.inlineData.mimeType || "image/png";
        result.imageUrl = `data:${result.mimeType};base64,${result.imageBase64}`;
      }
    }

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiClient] editImage() completed", {
        hasImage: !!result.imageBase64,
        hasText: !!result.text,
        imageDataLength: result.imageBase64?.length ?? 0,
      });
    }

    return result;
  }
}

export const geminiImageEditService = new GeminiImageEditService();
