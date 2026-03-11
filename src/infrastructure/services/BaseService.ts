import { geminiClient } from "./GeminiClient";
import { toSdkContent } from "../utils/content-mapper.util";
import { createGeminiError } from "../utils/error-mapper.util";
import { GeminiError } from "../../domain/entities";
import type { GeminiContent, GeminiGenerationConfig } from "../../domain/entities";
import type { GenerativeModel } from "@google/generative-ai";

export interface BaseRequestOptions {
  model: string;
  contents: GeminiContent[];
  generationConfig?: GeminiGenerationConfig;
  signal?: AbortSignal;
}

export abstract class BaseGeminiService {
  protected validateAndPrepare(options: BaseRequestOptions): {
    genModel: GenerativeModel;
    sdkContents: Array<{ role: string; parts: Array<{ text: string }> }>;
  } {
    if (!options.contents || options.contents.length === 0) {
      throw new Error("Contents array cannot be empty");
    }

    if (options.signal?.aborted) {
      throw new Error("Request was aborted");
    }

    const genModel = geminiClient.getModel(options.model);
    const sdkContents = toSdkContent(options.contents);

    return { genModel, sdkContents };
  }

  protected handleError(error: unknown, abortMessage: string): never {
    if (error instanceof GeminiError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(abortMessage);
    }

    throw createGeminiError(error);
  }

  protected createRequestOptions(
    sdkContents: Array<{ role: string; parts: Array<{ text: string }> }>,
    generationConfig?: GeminiGenerationConfig
  ) {
    return { contents: sdkContents, generationConfig };
  }
}
