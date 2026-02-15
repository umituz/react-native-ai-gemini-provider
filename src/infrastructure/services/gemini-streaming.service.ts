import { BaseGeminiService } from "./base-gemini.service";
import { telemetryHooks } from "../telemetry";
import { processStream } from "../utils/stream-processor.util";
import type {
  GeminiContent,
  GeminiGenerationConfig,
} from "../../domain/entities";

class GeminiStreamingService extends BaseGeminiService {
  /**
   * Stream content generation
   *
   * @throws {GeminiError} For API-specific errors
   * @throws {Error} For validation or network errors
   *
   * @example
   * ```ts
   * const fullText = await streamContent(
   *   "gemini-2.5-flash-lite",
   *   [{ parts: [{ text: "Hello" }], role: "user" }],
   *   (chunk) => console.log(chunk)
   * );
   * ```
   */
  async streamContent(
    model: string,
    contents: GeminiContent[],
    onChunk: (text: string) => void,
    generationConfig?: GeminiGenerationConfig,
    signal?: AbortSignal,
  ): Promise<string> {
    // Validate callback
    if (typeof onChunk !== "function") {
      throw new Error("onChunk must be a function");
    }

    try {
      const { genModel, sdkContents } = this.validateAndPrepare({
        model,
        contents,
        generationConfig,
        signal,
      });

      const requestOptions = this.createRequestOptions(sdkContents, generationConfig);

      const result = signal
        ? await genModel.generateContentStream(requestOptions, { signal })
        : await genModel.generateContentStream(requestOptions);

      return await processStream(
        result.stream,
        onChunk,
        (error, context) => this.logStreamError(model, error, context)
      );
    } catch (error) {
      return this.handleError(error, "Stream generation was aborted");
    }
  }

  /**
   * Log stream errors via telemetry
   */
  private logStreamError(model: string, error: unknown, context?: string): void {
    try {
      telemetryHooks.logError(
        model,
        error instanceof Error ? error : new Error(String(error)),
        context
      );
    } catch {
      // Silently ignore telemetry errors
    }
  }
}

export const geminiStreamingService = new GeminiStreamingService();
