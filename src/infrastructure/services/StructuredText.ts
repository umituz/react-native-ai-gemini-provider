import { textGeneration } from "./TextGeneration";
import { parseJsonResponse } from "../utils/json-parser.util";
import { extractTextFromParts } from "../utils/content-mapper.util";
import type { GenerationConfig } from "@google/generative-ai";
import type {
  GeminiContent,
  GeminiGenerationConfig,
  GeminiResponse,
} from "../../domain/entities";

class StructuredTextService {
  async generateStructuredText<T>(
    model: string,
    prompt: string,
    schema: Record<string, unknown>,
    config?: Omit<GeminiGenerationConfig, "responseMimeType" | "responseSchema">,
    signal?: AbortSignal,
  ): Promise<T> {
    if (!prompt || prompt.trim().length < 3) {
      throw new Error("Prompt must be at least 3 characters");
    }

    if (!schema || typeof schema !== "object" || Object.keys(schema).length === 0) {
      throw new Error("Schema must be a non-empty object");
    }

    const generationConfig: GeminiGenerationConfig = {
      ...config,
      responseMimeType: "application/json",
      responseSchema: schema as unknown as GenerationConfig["responseSchema"],
    };

    const contents: GeminiContent[] = [
      { parts: [{ text: prompt }], role: "user" },
    ];

    const response = await textGeneration.generateContent(
      model,
      contents,
      generationConfig,
      signal,
    );

    return this.parseJSONResponse<T>(response);
  }

  private parseJSONResponse<T>(response: GeminiResponse): T {
    const candidates = response.candidates;

    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates in response");
    }

    const text = extractTextFromParts(candidates[0]?.content?.parts);

    if (!text || text.trim().length === 0) {
      throw new Error("Empty response received from Gemini");
    }

    return parseJsonResponse<T>(text);
  }
}

export const structuredText = new StructuredTextService();
