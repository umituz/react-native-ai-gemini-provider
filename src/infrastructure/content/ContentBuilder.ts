/**
 * Content Builder
 * Constructs Gemini API content from various input formats
 */

import type { GeminiContent, GeminiImageInput } from "../../domain/entities";
import { extractBase64Data } from "../utils/gemini-data-transformer.util";

export class ContentBuilder {
  buildContents(input: Record<string, unknown>): GeminiContent[] {
    const contents: GeminiContent[] = [];

    if (typeof input.prompt === "string") {
      const parts: GeminiContent["parts"] = [{ text: input.prompt }];

      // Handle single image
      if (input.image_url && typeof input.image_url === "string") {
        const imageData = this.parseImageUrl(input.image_url);
        if (imageData) {
          parts.push({ inlineData: imageData });
        }
      }

      // Handle multiple images
      if (Array.isArray(input.images)) {
        for (const img of input.images as GeminiImageInput[]) {
          parts.push({
            inlineData: {
              mimeType: img.mimeType,
              data: extractBase64Data(img.base64),
            },
          });
        }
      }

      contents.push({ parts, role: "user" });
    }

    if (Array.isArray(input.contents)) {
      contents.push(...(input.contents as GeminiContent[]));
    }

    return contents;
  }

  private parseImageUrl(
    imageUrl: string,
  ): { mimeType: string; data: string } | null {
    const base64Match = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (base64Match) {
      return {
        mimeType: base64Match[1],
        data: base64Match[2],
      };
    }
    return null;
  }
}
