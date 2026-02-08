/**
 * Gemini Text Generation Service
 * Handles text and multimodal content generation
 */

import { geminiClientCoreService } from "./gemini-client-core.service";
import { extractTextFromResponse } from "../utils/gemini-data-transformer.util";
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
        return part;
      }),
    }));

    try {
      const result = await genModel.generateContent({
          contents: sdkContents as Parameters<typeof genModel.generateContent>[0] extends { contents: infer C } ? C : never,
          generationConfig,
        });

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
}

export const geminiTextGenerationService = new GeminiTextGenerationService();

export const geminiTextService = geminiTextGenerationService;
