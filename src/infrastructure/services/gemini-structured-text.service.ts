
import { geminiTextGenerationService } from "./gemini-text-generation.service";
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
    // Validate schema structure before passing to SDK
    if (!schema || typeof schema !== "object" || Object.keys(schema).length === 0) {
      throw new Error("Schema must be a non-empty object");
    }

    const generationConfig: GeminiGenerationConfig = {
      ...config,
      responseMimeType: "application/json",
      // Pass schema directly - Google SDK will validate it
      responseSchema: schema as GenerationConfig["responseSchema"],
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

    let text = "";

    if (candidates[0]?.content?.parts) {
      text = candidates[0].content.parts
        .map((part) => "text" in part ? (part.text || "") : "")
        .join("");
    }

    if (!text || text.trim().length === 0) {
      throw new Error("Empty response received from Gemini");
    }

    // Clean and parse JSON (remove markdown code blocks if present)
    const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
      return JSON.parse(cleanedText) as T;
    } catch (error) {
      throw new Error(`Failed to parse structured response: ${error instanceof Error ? error.message : String(error)}. Cleaned text: ${cleanedText.substring(0, 200)}...`);
    }
  }
}

export const geminiStructuredTextService = new GeminiStructuredTextService();
