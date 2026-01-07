/**
 * Gemini Structured Text Service
 * Handles structured JSON response generation with schema validation
 */

import { geminiTextGenerationService } from "./gemini-text-generation.service";
import type {
  GeminiContent,
  GeminiGenerationConfig,
} from "../../domain/entities";

declare const __DEV__: boolean;

class GeminiStructuredTextService {
  /**
   * Generate structured JSON response with schema
   */
  async generateStructuredText<T>(
    model: string,
    prompt: string,
    schema: Record<string, unknown>,
    config?: Omit<GeminiGenerationConfig, "responseMimeType" | "responseSchema">,
  ): Promise<T> {
    const generationConfig: GeminiGenerationConfig = {
      ...config,
      responseMimeType: "application/json",
      responseSchema: schema as unknown as undefined,
    };

    const contents: GeminiContent[] = [
      { parts: [{ text: prompt }], role: "user" },
    ];

    const response = await geminiTextGenerationService.generateContent(
      model,
      contents,
      generationConfig,
    );

    return this.parseJSONResponse<T>(response);
  }

  /**
   * Generate structured JSON response with images and schema
   */
  async generateStructuredTextWithImages<T>(
    model: string,
    prompt: string,
    images: Array<{ base64: string; mimeType: string }>,
    schema: Record<string, unknown>,
    config?: Omit<GeminiGenerationConfig, "responseMimeType" | "responseSchema">,
  ): Promise<T> {
    const generationConfig: GeminiGenerationConfig = {
      ...config,
      responseMimeType: "application/json",
      responseSchema: schema as unknown as undefined,
    };

    const parts: GeminiContent["parts"] = [{ text: prompt }];

    for (const image of images) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.base64,
        },
      });
    }

    const contents: GeminiContent[] = [{ parts, role: "user" }];

    const response = await geminiTextGenerationService.generateContent(
      model,
      contents,
      generationConfig,
    );

    return this.parseJSONResponse<T>(response);
  }

  /**
   * Parse JSON response from Gemini
   */
  private parseJSONResponse<T>(response: unknown): T {
    const candidates = (response as { candidates?: Array<{ content: { parts: Array<{ text?: string }> } }> }).candidates;

    let text = "";

    if (candidates?.[0]?.content?.parts) {
      text = candidates[0].content.parts
        .map((part) => part.text || "")
        .join("");
    }

    // Clean and parse JSON (remove markdown code blocks if present)
    const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
      return JSON.parse(cleanedText) as T;
    } catch (error) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.error("[Gemini] Failed to parse structured response:", {
          text: cleanedText.substring(0, 200),
          error: error instanceof Error ? error.message : String(error),
        });
      }
      throw new Error(`Failed to parse structured response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export const geminiStructuredTextService = new GeminiStructuredTextService();
