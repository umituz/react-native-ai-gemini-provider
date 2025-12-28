/**
 * Image Preparer Utility
 * Prepares images for Gemini API
 * Shared utility - used by all image processing features
 */

declare const __DEV__: boolean;

export interface PreparedImage {
  base64: string;
  mimeType: string;
}

function getMimeTypeFromUri(uri: string): string {
  const extension = uri.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  };
  return mimeTypes[extension || ""] || "image/jpeg";
}

function extractBase64FromDataUrl(dataUrl: string): string {
  const match = dataUrl.match(/^data:[^;]+;base64,(.+)$/);
  return match ? match[1] : dataUrl;
}

export async function prepareImageFromUri(
  uri: string,
): Promise<PreparedImage> {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log("[ImagePreparer] Preparing image from URI");
  }

  if (uri.startsWith("data:")) {
    const mimeMatch = uri.match(/^data:([^;]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const base64 = extractBase64FromDataUrl(uri);
    return { base64, mimeType };
  }

  const response = await fetch(uri);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64 = extractBase64FromDataUrl(dataUrl);
      const mimeType = blob.type || getMimeTypeFromUri(uri);
      resolve({ base64, mimeType });
    };
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(blob);
  });
}

export function isValidBase64(str: string): boolean {
  if (!str || str.length === 0) return false;
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
}

/**
 * Alias for prepareImageFromUri for backwards compatibility
 */
export const prepareImage = prepareImageFromUri;
