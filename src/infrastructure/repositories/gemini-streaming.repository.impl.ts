/**
 * Gemini Streaming Repository Implementation
 */

import type { GeminiGenerationConfig } from "../../domain/entities";
import type {
  IStreamingRepository,
  StreamingRequest,
} from "../../domain/repositories/streaming.repository";
import { ValidationService } from "../../domain/services/validation.service";
import { ContentMapper } from "../mappers/content.mapper";
import { BaseGeminiRepository } from "./base-gemini.repository";

interface StreamChunk {
  text(): string;
}

export class GeminiStreamingRepository
  extends BaseGeminiRepository
  implements IStreamingRepository
{
  constructor(
    getModel: (name: string) => unknown,
    validator: ValidationService,
    contentMapper: ContentMapper
  ) {
    super(getModel as (name: string) => any, validator, contentMapper);
  }

  /**
   * Stream text content
   */
  async stream(request: StreamingRequest): Promise<string> {
    this.validator.validateCallback(request.onChunk, "onChunk");

    return this.executeWithErrorHandling(async () => {
      const { genModel, sdkContents, config, signal } =
        this.prepareRequest(request);

      const requestOptions = this.createRequestOptions(
        sdkContents,
        config
      );

      const result = signal
        ? await (genModel as any).generateContentStream(
            requestOptions,
            { signal }
          )
        : await (genModel as any).generateContentStream(requestOptions);

      return await this.processStream(
        result.stream,
        request.onChunk
      );
    }, "GeminiStreamingRepository.stream");
  }

  /**
   * Stream simple text from prompt
   */
  async streamText(
    model: string,
    prompt: string,
    onChunk: (text: string) => void,
    config?: GeminiGenerationConfig,
    signal?: AbortSignal
  ): Promise<string> {
    this.validator.validatePrompt(prompt);

    const contents = [this.contentMapper.createTextContent(prompt, "user")];
    return this.stream({
      model,
      contents,
      onChunk,
      generationConfig: config,
      signal,
    });
  }

  /**
   * Process stream with chunk callback
   */
  private async processStream(
    stream: AsyncIterable<StreamChunk>,
    onChunk: (text: string) => void
  ): Promise<string> {
    let fullText = "";

    for await (const chunk of stream) {
      try {
        const chunkText = chunk.text();
        if (chunkText) {
          fullText += chunkText;
          this.safeCallChunk(onChunk, chunkText);
        }
      } catch (chunkError) {
        // Chunk errors are critical (e.g., safety blocks)
        throw chunkError;
      }
    }

    return fullText;
  }

  /**
   * Safely call chunk callback
   */
  private safeCallChunk(
    callback: (text: string) => void,
    text: string
  ): void {
    try {
      callback(text);
    } catch {
      // Silently ignore callback errors
    }
  }
}
