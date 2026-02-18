/**
 * JSON Parser Utilities
 * Handles cleaning and parsing JSON responses from AI models
 */

/**
 * Clean JSON text by removing markdown code blocks and extra whitespace
 */
function cleanJsonText(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
}

/**
 * Parse JSON response with error handling
 * @throws Error if parsing fails with detailed error message
 */
export function parseJsonResponse<T>(text: string): T {
  const cleanedText = cleanJsonText(text);

  if (!cleanedText || cleanedText.length === 0) {
    throw new Error("Empty JSON response received");
  }

  try {
    return JSON.parse(cleanedText) as T;
  } catch (error) {
    const preview = cleanedText.substring(0, 200);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to parse JSON response: ${errorMessage}. Response preview: ${preview}...`
    );
  }
}

