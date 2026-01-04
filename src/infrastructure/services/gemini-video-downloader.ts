/**
 * Gemini Video Downloader
 * Single Responsibility: Download video from Veo URL and convert to base64
 * Required because Veo URLs need x-goog-api-key authentication
 */

declare const __DEV__: boolean;

export interface VideoDownloadResult {
  base64DataUri: string;
  sizeInMB: number;
  mimeType: string;
}

/**
 * Download video from authenticated Veo URL
 */
export async function downloadVideoFromVeo(
  videoUrl: string,
  apiKey: string,
): Promise<VideoDownloadResult> {
  if (typeof __DEV__ !== "undefined" && __DEV__) {
    // eslint-disable-next-line no-console
    console.log("[GeminiVideoDownloader] Downloading video from Veo...");
  }

  const response = await fetch(videoUrl, {
    method: "GET",
    headers: {
      "x-goog-api-key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.status}`);
  }

  const blob = await response.blob();
  const sizeInMB = blob.size / 1024 / 1024;

  if (typeof __DEV__ !== "undefined" && __DEV__) {
    // eslint-disable-next-line no-console
    console.log("[GeminiVideoDownloader] Video downloaded", {
      size: `${sizeInMB.toFixed(2)} MB`,
      type: blob.type,
    });
  }

  const base64DataUri = await convertBlobToBase64(blob);

  return {
    base64DataUri,
    sizeInMB,
    mimeType: blob.type || "video/mp4",
  };
}

/**
 * Convert blob to base64 data URI
 */
function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log("[GeminiVideoDownloader] Video converted to base64", {
          length: base64.length,
        });
      }
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to convert video to base64"));
    reader.readAsDataURL(blob);
  });
}
