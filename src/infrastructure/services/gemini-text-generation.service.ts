
import { geminiClientCoreService } from "./gemini-client-core.service";
import { extractTextFromResponse } from "../utils/gemini-data-transformer.util";
import type {
  GeminiContent,
  GeminiGenerationConfig,
  GeminiResponse,
  GeminiPart,
} from "../../domain/entities";

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

    const sdkContents = contents.map((content) => ({
      role: content.role || "user",
      parts: content.parts,
    }));

    const result = await genModel.generateContent({
      contents: sdkContents as Parameters<typeof genModel.generateContent>[0] extends { contents: infer C } ? C : never,
      generationConfig,
    });

    const response = (result as { response: GeminiResponse }).response;

    return {
      candidates: response.candidates?.map((candidate) => {
        const transformedParts: GeminiPart[] = [];
        for (const part of candidate.content.parts) {
          if ("text" in part && typeof part.text === "string") {
            transformedParts.push({ text: part.text });
          }
          // Ignore unsupported part types (inlineData, etc.)
        }

        return {
          content: {
            parts: transformedParts,
            role: (candidate.content.role || "model"),
          },
          finishReason: candidate.finishReason,
        };
      }),
    };
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
