/**
 * Gemini Text Generation Service
 * Handles text and multimodal content generation
 */

import { geminiClientCoreService } from "./gemini-client-core.service";
import { geminiRetryService } from "./gemini-retry.service";
import { extractBase64Data, extractTextFromResponse } from "../utils/gemini-data-transformer.util";
import type {
  GeminiContent,
  GeminiGenerationConfig,
  GeminiResponse,
  GeminiPart,
} from "../../domain/entities";

declare const __DEV__: boolean;

class GeminiTextGenerationService {
  /**
   * Generate content (text, with optional images)
   */
  async generateContent(
    model: string,
    contents: GeminiContent[],
    generationConfig?: GeminiGenerationConfig,
  ): Promise<GeminiResponse> {
    const genModel = geminiClientCoreService.getModel(model);

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[Gemini] Generate content:", { model });
    }

    const sdkContents = contents.map((content) => ({
      role: content.role || "user",
      parts: content.parts.map((part) => {
        if ("text" in part) {
          return { text: part.text };
        }
        if ("inlineData" in part) {
          return {
            inlineData: {
              mimeType: part.inlineData.mimeType,
              data: part.inlineData.data,
            },
          };
        }
        return part;
      }),
    }));

    try {
      const result = await geminiRetryService.executeWithRetry(() =>
        genModel.generateContent({
          contents: sdkContents as Parameters<typeof genModel.generateContent>[0] extends { contents: infer C } ? C : never,
          generationConfig,
        }),
      );

      const response = (result as { response: GeminiResponse }).response;

      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log("[Gemini] Content generated:", {
          candidatesCount: response.candidates?.length ?? 0,
          finishReason: response.candidates?.[0]?.finishReason,
        });
      }

      return {
        candidates: response.candidates?.map((candidate) => ({
          content: {
            parts: candidate.content.parts
              .map((part): GeminiPart | null => {
                if ("text" in part && part.text !== undefined) {
                  return { text: part.text };
                }
                if ("inlineData" in part && part.inlineData) {
                  return {
                    inlineData: {
                      mimeType: part.inlineData.mimeType,
                      data: part.inlineData.data,
                    },
                  };
                }
                return null;
              })
              .filter((p): p is GeminiPart => p !== null),
            role: (candidate.content.role || "model"),
          },
          finishReason: candidate.finishReason,
        })),
      };
    } catch (error) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.error("[Gemini] Content generation failed:", {
          model,
          error: error instanceof Error ? error.message : String(error),
        });
      }
      throw error;
    }
  }

  /**
   * Generate text from prompt
   */
  async generateText(
    model: string,
    prompt: string,
    config?: GeminiGenerationConfig,
  ): Promise<string> {
    const contents: GeminiContent[] = [
      { parts: [{ text: prompt }], role: "user" },
    ];

    const response = await this.generateContent(model, contents, config);
    return extractTextFromResponse(response);
  }

  /**
   * Generate content with images (multimodal)
   */
  async generateWithImages(
    model: string,
    prompt: string,
    images: Array<{ base64: string; mimeType: string }>,
    config?: GeminiGenerationConfig,
  ): Promise<GeminiResponse> {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiClient] generateWithImages() called", {
        model,
        promptLength: prompt.length,
        imagesCount: images.length,
        imageMimeTypes: images.map(i => i.mimeType),
      });
    }

    const parts: GeminiContent["parts"] = [{ text: prompt }];

    for (const image of images) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: extractBase64Data(image.base64),
        },
      });
    }

    const contents: GeminiContent[] = [{ parts, role: "user" }];

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[GeminiClient] generateWithImages() → calling generateContent()");
    }

    return this.generateContent(model, contents, config);
  }
}

export const geminiTextGenerationService = new GeminiTextGenerationService();
