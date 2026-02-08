/**
 * Content Builder
 * Constructs Gemini API content from various input formats
 */

import type { GeminiContent } from "../../domain/entities";

export class ContentBuilder {
  buildContents(input: Record<string, unknown>): GeminiContent[] {
    const contents: GeminiContent[] = [];

    if (typeof input.prompt === "string") {
      // Create parts array properly typed as GeminiPart[]
      const parts = [{ text: input.prompt }];
      contents.push({ parts, role: "user" });
    }

    if (Array.isArray(input.contents)) {
      contents.push(...(input.contents as GeminiContent[]));
    }

    return contents;
  }
}
