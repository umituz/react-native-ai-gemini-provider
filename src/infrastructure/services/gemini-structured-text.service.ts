
import { geminiTextGenerationService } from "./gemini-text-generation.service";
import type { GenerationConfig } from "@google/generative-ai";
import type {
  GeminiContent,
  GeminiGenerationConfig,
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
      throw new Error(`Failed to parse structured response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export const geminiStructuredTextService = new GeminiStructuredTextService();
