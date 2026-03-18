/**
 * Gemini Structured Text Repository Implementation
 */

import type { GeminiContent, GeminiGenerationConfig } from "../../domain/entities";
import type {
  IStructuredTextRepository,
  StructuredGenerationRequest,
} from "../../domain/repositories/structured-text.repository";
import { ValidationService } from "../../domain/services/validation.service";
import { ContentMapper } from "../mappers/content.mapper";
import { ResponseMapper } from "../mappers/response.mapper";
import { parseJsonResponse } from "../utils/json-parser.util";
import { BaseGeminiRepository } from "./base-gemini.repository";

export class GeminiStructuredTextRepository
  extends BaseGeminiRepository
  implements IStructuredTextRepository
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
   * Generate structured JSON from prompt
   */
  async generateStructured<T>(
    request: StructuredGenerationRequest
  ): Promise<T> {
    this.validator.validatePrompt(request.prompt);
    this.validator.validateSchema(request.schema);

    const generationConfig: GeminiGenerationConfig = {
      ...request.config,
      responseMimeType: "application/json",
      responseSchema: request.schema as any,
    };

    const contents = [
      this.contentMapper.createTextContent(request.prompt, "user"),
    ];

    return this.generateStructuredFromContents<T>(
      request.model,
      contents,
      request.schema,
      generationConfig,
      request.signal
    );
  }

  /**
   * Generate structured JSON from contents
   */
  async generateStructuredFromContents<T>(
    model: string,
    contents: GeminiContent[],
    schema: Record<string, unknown>,
    config?: GeminiGenerationConfig,
    signal?: AbortSignal
  ): Promise<T> {
    const generationConfig: GeminiGenerationConfig = {
      ...config,
      responseMimeType: "application/json",
      responseSchema: schema as any,
    };

    return this.executeWithErrorHandling(async () => {
      const { genModel, sdkContents, config: finalConfig } =
        this.prepareRequest({
          model,
          contents,
          generationConfig: generationConfig,
          signal,
        });

      const requestOptions = this.createRequestOptions(
        sdkContents,
        finalConfig
      );

      const result = signal
        ? await (genModel as any).generateContent(requestOptions, {
            signal,
          })
        : await (genModel as any).generateContent(requestOptions);

      if (!result.response) {
        throw new Error("No response received from Gemini API");
      }

      const response = this.responseMapper.toDomain(result.response);
      const candidates = response.candidates;

      if (!candidates || candidates.length === 0) {
        throw new Error("No candidates in response");
      }

      const text = this.responseMapper.extractText(response);
      return parseJsonResponse<T>(text);
    }, "GeminiStructuredTextRepository.generateStructuredFromContents");
  }
}
