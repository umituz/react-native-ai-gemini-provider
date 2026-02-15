import { BaseGeminiService } from "./base-gemini.service";
import { extractTextFromResponse } from "../utils/gemini-data-transformer.util";
import { transformResponse, createTextContent } from "../utils/content-mapper.util";
import { validatePrompt } from "../utils/validation.util";
import type {
  GeminiContent,
  GeminiGenerationConfig,
  GeminiResponse,
} from "../../domain/entities";

class GeminiTextGenerationService extends BaseGeminiService {
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
    try {
      const { genModel, sdkContents } = this.validateAndPrepare({
        model,
        contents,
        generationConfig,
        signal,
      });

      const requestOptions = this.createRequestOptions(sdkContents, generationConfig);

      const result = signal
        ? await genModel.generateContent(requestOptions, { signal })
        : await genModel.generateContent(requestOptions);

      const response = result.response;

      if (!response) {
        throw new Error("No response received from Gemini API");
      }

      return transformResponse(response);
    } catch (error) {
      return this.handleError(error, "Request was aborted");
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
