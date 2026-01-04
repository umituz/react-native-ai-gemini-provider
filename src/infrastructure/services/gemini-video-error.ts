/**
 * Gemini Video Error Factory
 * Single Responsibility: Create typed video generation errors
 */

import type { VideoGenerationError } from "../../domain/entities";

/**
 * Create a typed video generation error
 */
export function createVideoError(
  type: VideoGenerationError["type"],
  message: string,
  statusCode?: number,
): VideoGenerationError {
  const error = new Error(message) as VideoGenerationError;
  error.type = type;
  error.statusCode = statusCode;
  error.retryable = type === "NETWORK" || type === "TIMEOUT";
  return error;
}
