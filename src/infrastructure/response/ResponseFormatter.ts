/**
 * Response Formatter
 * Formats Gemini API responses into consistent output structure
 */

declare const __DEV__: boolean;

export class ResponseFormatter {
  formatResponse<T>(
    response: unknown,
    input: Record<string, unknown>,
  ): T {
    const resp = response as {
      candidates?: Array<{
        content: {
          parts: Array<{
            text?: string;
            inlineData?: { mimeType: string; data: string };
          }>;
        };
      }>;
    };

    const candidate = resp.candidates?.[0];
    const parts = candidate?.content.parts || [];

    // Extract text
    const text = parts.find((p) => p.text)?.text;

    // Extract image if present
    const imagePart = parts.find((p) => p.inlineData);
    const imageData = imagePart?.inlineData;

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[ResponseFormatter] Formatting response:", {
        hasText: !!text,
        textLength: text?.length ?? 0,
        hasImage: !!imageData,
        outputFormat: input.outputFormat,
      });
    }

    // Build result object - always return { text } for consistency
    const result: Record<string, unknown> = {
      text,
      response,
    };

    if (imageData) {
      result.imageUrl = `data:${imageData.mimeType};base64,${imageData.data}`;
      result.imageBase64 = imageData.data;
      result.mimeType = imageData.mimeType;
    }

    return result as T;
  }
}
