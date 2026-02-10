
import { geminiClientCoreService } from "./gemini-client-core.service";
import { extractTextFromResponse } from "../utils/gemini-data-transformer.util";
import { toSdkContent, transformResponse, createTextContent } from "../utils/content-mapper.util";
import { validatePrompt } from "../utils/validation.util";
import { createGeminiError } from "../utils/error-mapper.util";
import type {
  GeminiContent,
  GeminiGenerationConfig,
  GeminiResponse,
} from "../../domain/entities";

class GeminiTextGenerationService {
  /**
   * Generate content (text, with optional images)
   *
   * @throws {GeminiError} For API-specific errors
   * @throws {Error} For validation or network errors
   */
  async generateContent(
    model: string,
    contents: GeminiContent[],
    generationConfig?: GeminiGenerationConfig,
    signal?: AbortSignal,
  ): Promise<GeminiResponse> {
    // Validate input
    if (!contents || contents.length === 0) {
      throw new Error("Contents array cannot be empty");
    }

    // Check for early abort
    if (signal?.aborted) {
      throw new Error("Request was aborted");
    }

    try {
      const genModel = geminiClientCoreService.getModel(model);
      const sdkContents = toSdkContent(contents);

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

      return transformResponse(response);
    } catch (error) {
      // Re-throw as GeminiError if it's an API error
      if (error instanceof Error && error.name === "GeminiError") {
        throw error;
      }

      // Check for abort error
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request was aborted");
      }

      // Wrap other errors
      throw createGeminiError(error);
    }
  }

  /**
   * Generate text from prompt
   *
   * @throws {GeminiError} For API-specific errors
   * @throws {Error} For validation or network errors
   */
  async generateText(
    model: string,
    prompt: string,
    config?: GeminiGenerationConfig,
    signal?: AbortSignal,
  ): Promise<string> {
    // Validate prompt
    validatePrompt(prompt);

    const contents: GeminiContent[] = [createTextContent(prompt, "user")];

    const response = await this.generateContent(model, contents, config, signal);
    return extractTextFromResponse(response);
  }
}

export const geminiTextGenerationService = new GeminiTextGenerationService();
