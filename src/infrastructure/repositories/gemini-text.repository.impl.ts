/**
 * Gemini Text Generation Repository Implementation
 */

import type { GeminiGenerationConfig, GeminiResponse } from "../../domain/entities";
import type {
  ITextGenerationRepository,
  TextGenerationRequest,
} from "../../domain/repositories/text-generation.repository";
import { ValidationService } from "../../domain/services/validation.service";
import { ContentMapper } from "../mappers/content.mapper";
import { ResponseMapper } from "../mappers/response.mapper";
import { BaseGeminiRepository } from "./base-gemini.repository";

export class GeminiTextRepository
  extends BaseGeminiRepository
  implements ITextGenerationRepository
{
  constructor(
    getModel: (name: string) => unknown,
    validator: ValidationService,
    contentMapper: ContentMapper,
    private readonly responseMapper: ResponseMapper
  ) {
    super(getModel as (name: string) => any, validator, contentMapper);
  }

  /**
   * Generate text content
   */
  async generate(request: TextGenerationRequest): Promise<GeminiResponse> {
    return this.executeWithErrorHandling(async () => {
      const { genModel, sdkContents, config, signal } =
        this.prepareRequest(request);

      const requestOptions = this.createRequestOptions(
        sdkContents,
        config
      );

      const result = signal
        ? await (genModel as any).generateContent(requestOptions, {
            signal,
          })
        : await (genModel as any).generateContent(requestOptions);

      if (!result.response) {
        throw new Error("No response received from Gemini API");
      }

      return this.responseMapper.toDomain(result.response);
    }, "GeminiTextRepository.generate");
  }

  /**
   * Generate simple text from prompt
   */
  async generateText(
    model: string,
    prompt: string,
    config?: GeminiGenerationConfig,
    signal?: AbortSignal
  ): Promise<string> {
    this.validator.validatePrompt(prompt);

    const contents = [this.contentMapper.createTextContent(prompt, "user")];
    const response = await this.generate({
      model,
      contents,
      generationConfig: config,
      signal,
    });

    return this.responseMapper.extractText(response);
  }
}
