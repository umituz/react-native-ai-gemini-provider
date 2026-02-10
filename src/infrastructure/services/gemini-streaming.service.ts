
import { geminiClientCoreService } from "./gemini-client-core.service";
import { toSdkContent } from "../utils/content-mapper.util";
import { createGeminiError } from "../utils/error-mapper.util";
import { telemetryHooks } from "../telemetry";
import type {
  GeminiContent,
  GeminiGenerationConfig,
} from "../../domain/entities";

class GeminiStreamingService {
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
    // Validate input
    if (!contents || contents.length === 0) {
      throw new Error("Contents array cannot be empty");
    }

    if (typeof onChunk !== "function") {
      throw new Error("onChunk must be a function");
    }

    // Check for early abort
    if (signal?.aborted) {
      throw new Error("Stream generation was aborted");
    }

    try {
      const genModel = geminiClientCoreService.getModel(model);
      const sdkContents = toSdkContent(contents);

      const requestOptions = {
        contents: sdkContents as Parameters<typeof genModel.generateContentStream>[0] extends { contents: infer C } ? C : never,
        generationConfig,
      };

      const result = signal
        ? await genModel.generateContentStream(requestOptions, { signal })
        : await genModel.generateContentStream(requestOptions);

      let fullText = "";

      for await (const chunk of result.stream) {
        try {
          const chunkText = chunk.text();
          if (chunkText) {
            fullText += chunkText;
            // Safely call onChunk - errors in callback won't break the stream
            try {
              onChunk(chunkText);
            } catch (callbackError) {
              try {
                telemetryHooks.logError(model, callbackError instanceof Error ? callbackError : new Error(String(callbackError)), "stream-callback");
              } catch {
                // Silently ignore telemetry errors to prevent breaking the stream
              }
            }
          }
        } catch (chunkError) {
          // Log chunk error via telemetry, but don't let telemetry errors break the stream
          try {
            telemetryHooks.logError(model, chunkError instanceof Error ? chunkError : new Error(String(chunkError)), "stream-chunk");
          } catch {
            // Silently ignore telemetry errors
          }
        }
      }

      return fullText;
    } catch (error) {
      // Re-throw as GeminiError if it's an API error
      if (error instanceof Error && error.name === "GeminiError") {
        throw error;
      }

      // Check for abort error
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Stream generation was aborted");
      }

      // Wrap other errors
      throw createGeminiError(error);
    }
  }
}

export const geminiStreamingService = new GeminiStreamingService();
