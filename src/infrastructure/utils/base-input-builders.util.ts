/**
 * Base Input Builders
 * Provides core input construction functions
 */

/**
 * Build Gemini single image input format
 */
export function buildSingleImageInput(
  base64: string,
  prompt: string,
): Record<string, unknown> {
  const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, "");

  return {
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
        ],
      },
    ],
  };
}

/**
 * Build Gemini dual image input format
 */
export function buildDualImageInput(
  sourceBase64: string,
  targetBase64: string,
  prompt: string,
): Record<string, unknown> {
  const cleanSource = sourceBase64.replace(/^data:image\/\w+;base64,/, "");
  const cleanTarget = targetBase64.replace(/^data:image\/\w+;base64,/, "");

  return {
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: cleanSource } },
          { inlineData: { mimeType: "image/jpeg", data: cleanTarget } },
        ],
      },
    ],
  };
}
