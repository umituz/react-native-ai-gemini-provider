
import type { GeminiResponse } from "../../domain/entities";


export function extractTextFromResponse(response: GeminiResponse): string {
  const candidate = response.candidates?.[0];

  if (!candidate) {
    throw new Error("No response candidates");
  }

  // Handle all finish reasons appropriately
  switch (candidate.finishReason) {
    case "SAFETY":
      throw new Error("Content blocked by safety filters");
    case "RECITATION":
      throw new Error("Content blocked due to recitation concerns");
    case "MAX_TOKENS":
    case "FINISH_REASON_UNSPECIFIED":
    case "OTHER":
    case "STOP":
      // Continue to extract text
      break;
  }

  const textPart = candidate.content.parts.find(
    (p): p is { text: string } => "text" in p && typeof p.text === "string",
  );

  if (!textPart) {
    throw new Error("No text in response");
  }

  return textPart.text;
}
