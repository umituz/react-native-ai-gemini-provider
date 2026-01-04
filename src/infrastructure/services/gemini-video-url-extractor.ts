/**
 * Gemini Video URL Extractor
 * Single Responsibility: Extract video URL from Veo operation response
 * Handles multiple response formats from Veo API
 */

import type { VeoOperation } from "../../domain/entities";

declare const __DEV__: boolean;

/**
 * Extract video URL from Veo operation response
 * Handles multiple response formats from different Veo API versions
 */
export function extractVideoUrl(operation: VeoOperation): string | null {
  const response = operation.response;
  if (!response) return null;

  // Format 1: generatedVideos[].video.uri (new SDK format)
  if (response.generatedVideos?.[0]?.video?.uri) {
    return response.generatedVideos[0].video.uri;
  }

  // Format 2: generatedVideos[].video.url
  if (response.generatedVideos?.[0]?.video?.url) {
    return response.generatedVideos[0].video.url;
  }

  // Format 3: candidates[].uri (legacy format)
  if (response.candidates?.[0]?.uri) {
    return response.candidates[0].uri;
  }

  // Format 4: generateVideoResponse.generatedSamples[].video.uri (REST API format)
  if (response.generateVideoResponse?.generatedSamples?.[0]?.video?.uri) {
    return response.generateVideoResponse.generatedSamples[0].video.uri;
  }

  if (typeof __DEV__ !== "undefined" && __DEV__) {
    // eslint-disable-next-line no-console
    console.warn("[GeminiVideoUrlExtractor] No video URL found in response");
  }

  return null;
}
