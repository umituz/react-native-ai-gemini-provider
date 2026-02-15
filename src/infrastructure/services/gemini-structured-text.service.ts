
import { geminiTextGenerationService } from "./gemini-text-generation.service";
import { parseJsonResponse } from "../utils/json-parser.util";
import { extractTextFromParts } from "../utils/content-mapper.util";
import { validateSchema } from "../utils/validation.util";
import type { GenerationConfig } from "@google/generative-ai";
import type {
  GeminiContent,
  GeminiGenerationConfig,
  GeminiResponse,
} from "../../domain/entities";


class GeminiStructuredTextService {
  /**
   * Generate structured JSON response with schema
   */
  async generateStructuredText<T>(
    model: string,
    prompt: string,
    schema: Record<string, unknown>,
    config?: Omit<GeminiGenerationConfig, "responseMimeType" | "responseSchema">,
    signal?: AbortSignal,
  ): Promise<T> {
    validateSchema(schema);

    const generationConfig: GeminiGenerationConfig = {
      ...config,
      responseMimeType: "application/json",
      responseSchema: schema as unknown as GenerationConfig["responseSchema"],
    };

    const contents: GeminiContent[] = [
      { parts: [{ text: prompt }], role: "user" },
    ];

    const response = await geminiTextGenerationService.generateContent(
      model,
      contents,
      generationConfig,
      signal,
    );

    return this.parseJSONResponse<T>(response);
  }

  /**
   * Parse JSON response from Gemini
   */
  private parseJSONResponse<T>(response: GeminiResponse): T {
    const candidates = response.candidates;

    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates in response");
    }

    const text = extractTextFromParts(candidates[0].content.parts);

    if (!text || text.trim().length === 0) {
      throw new Error("Empty response received from Gemini");
    }

    return parseJsonResponse<T>(text);
  }
}

export const geminiStructuredTextService = new GeminiStructuredTextService();
