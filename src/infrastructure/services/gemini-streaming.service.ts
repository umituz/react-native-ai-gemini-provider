/**
 * Gemini Streaming Service
 * Handles streaming content generation
 */

import { geminiClientCoreService } from "./gemini-client-core.service";
import type {
  GeminiContent,
  GeminiGenerationConfig,
} from "../../domain/entities";

class GeminiStreamingService {
  /**
   * Stream content generation
   */
  async streamContent(
    model: string,
    contents: GeminiContent[],
    onChunk: (text: string) => void,
    generationConfig?: GeminiGenerationConfig,
  ): Promise<string> {
    const genModel = geminiClientCoreService.getModel(model);

    const sdkContents = contents.map((content) => ({
      role: content.role || "user",
      parts: content.parts.map((part) => ({ text: part.text })),
    }));

    const result = await genModel.generateContentStream({
      contents: sdkContents as Parameters<typeof genModel.generateContentStream>[0] extends { contents: infer C } ? C : never,
      generationConfig,
    });

    let fullText = "";

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        fullText += chunkText;
        onChunk(chunkText);
      }
    }

    return fullText;
  }
}

export const geminiStreamingService = new GeminiStreamingService();
