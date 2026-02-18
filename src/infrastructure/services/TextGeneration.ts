import { BaseGeminiService } from "./BaseService";
import { extractTextFromResponse } from "../utils/gemini-data-transformer.util";
import { transformResponse, createTextContent } from "../utils/content-mapper.util";
import type {
  GeminiContent,
  GeminiGenerationConfig,
  GeminiResponse,
} from "../../domain/entities";

class TextGenerationService extends BaseGeminiService {
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

      if (!result.response) {
        throw new Error("No response received from Gemini API");
      }

      return transformResponse(result.response);
    } catch (error) {
      return this.handleError(error, "Request was aborted");
    }
  }

  async generateText(
    model: string,
    prompt: string,
    config?: GeminiGenerationConfig,
    signal?: AbortSignal,
  ): Promise<string> {
    if (!prompt || prompt.trim().length < 3) {
      throw new Error("Prompt must be at least 3 characters");
    }

    const contents: GeminiContent[] = [createTextContent(prompt, "user")];
    const response = await this.generateContent(model, contents, config, signal);
    return extractTextFromResponse(response);
  }
}

export const textGeneration = new TextGenerationService();
