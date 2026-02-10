/**
 * JSON Parser Utilities
 * Handles cleaning and parsing JSON responses from AI models
 */

/**
 * Clean JSON text by removing markdown code blocks and extra whitespace
 */
export function cleanJsonText(text: string): string {
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

/**
 * Safely parse JSON with optional fallback value
 */
export function safeParseJson<T>(
  text: string,
  fallback: T
): T {
  try {
    return parseJsonResponse<T>(text);
  } catch {
    return fallback;
  }
}

/**
 * Extract and parse JSON from a larger text response
 * Looks for JSON objects within markdown code blocks or standalone
 */
export function extractJsonFromText<T>(text: string): T | null {
  // Try to find JSON in code blocks first
  const codeBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim()) as T;
    } catch {
      // Continue to other methods
    }
  }

  // Try to find JSON object boundaries
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      const jsonStr = text.substring(firstBrace, lastBrace + 1);
      return JSON.parse(jsonStr) as T;
    } catch {
      // Continue to fallback
    }
  }

  // Try parsing the whole text as JSON
  try {
    return parseJsonResponse<T>(text);
  } catch {
    return null;
  }
}
