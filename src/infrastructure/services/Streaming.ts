import { BaseGeminiService } from "./BaseService";
import { telemetryHooks } from "../telemetry/TelemetryHooks";
import { processStream } from "../utils/stream-processor.util";
import type {
  GeminiContent,
  GeminiGenerationConfig,
} from "../../domain/entities";

class StreamingService extends BaseGeminiService {
  async streamContent(
    model: string,
    contents: GeminiContent[],
    onChunk: (text: string) => void,
    generationConfig?: GeminiGenerationConfig,
    signal?: AbortSignal,
  ): Promise<string> {
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
        (error, context) => {
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
      );
    } catch (error) {
      return this.handleError(error, "Stream generation was aborted");
    }
  }
}

export const streaming = new StreamingService();
