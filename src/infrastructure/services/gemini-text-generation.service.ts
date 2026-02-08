
import { geminiClientCoreService } from "./gemini-client-core.service";
import { extractTextFromResponse } from "../utils/gemini-data-transformer.util";
import type {
  GeminiContent,
  GeminiGenerationConfig,
  GeminiResponse,
  GeminiPart,
  GeminiFinishReason,
  GeminiSafetyRating,
} from "../../domain/entities";

class GeminiTextGenerationService {
  /**
   * Generate content (text, with optional images)
   */
  async generateContent(
    model: string,
    contents: GeminiContent[],
    generationConfig?: GeminiGenerationConfig,
    signal?: AbortSignal,
  ): Promise<GeminiResponse> {
    const genModel = geminiClientCoreService.getModel(model);

    const sdkContents = contents.map((content) => ({
      role: content.role || "user",
      parts: content.parts,
    }));

    const requestOptions = {
      contents: sdkContents as Parameters<typeof genModel.generateContent>[0] extends { contents: infer C } ? C : never,
      generationConfig,
    };

    const result = signal
      ? await genModel.generateContent(requestOptions, { signal })
      : await genModel.generateContent(requestOptions);

    const response = result.response;

    if (!response) {
      throw new Error("No response received from Gemini API");
    }

    return {
      candidates: response.candidates?.map((candidate) => {
        const transformedParts: GeminiPart[] = [];
        for (const part of candidate.content.parts) {
          if ("text" in part && typeof part.text === "string") {
            transformedParts.push({ text: part.text });
          }
          // Ignore unsupported part types (inlineData, etc.)
        }

        // Map SDK finish reason to our domain type
        const finishReason: GeminiFinishReason | undefined = candidate.finishReason
          ? (candidate.finishReason as GeminiFinishReason)
          : undefined;

        // Map safety ratings
        const safetyRatings: GeminiSafetyRating[] | undefined = candidate.safetyRatings
          ? candidate.safetyRatings.map((rating) => ({
              category: rating.category as GeminiSafetyRating["category"],
              probability: rating.probability as GeminiSafetyRating["probability"],
            }))
          : undefined;

        return {
          content: {
            parts: transformedParts,
            role: (candidate.content.role || "model") as "user" | "model",
          },
          finishReason,
          safetyRatings,
        };
      }),
      usageMetadata: response.usageMetadata ? {
        promptTokenCount: response.usageMetadata.promptTokenCount,
        candidatesTokenCount: response.usageMetadata.candidatesTokenCount,
        totalTokenCount: response.usageMetadata.totalTokenCount,
      } : undefined,
    };
  }

  /**
   * Generate text from prompt
   */
  async generateText(
    model: string,
    prompt: string,
    config?: GeminiGenerationConfig,
    signal?: AbortSignal,
  ): Promise<string> {
    const contents: GeminiContent[] = [
      { parts: [{ text: prompt }], role: "user" },
    ];

    const response = await this.generateContent(model, contents, config, signal);
    return extractTextFromResponse(response);
  }
}

export const geminiTextGenerationService = new GeminiTextGenerationService();
