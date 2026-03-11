/**
 * Stream Processing Utilities
 * Reusable stream handling logic
 */

interface StreamChunk {
  text: () => string;
}

type ChunkCallback = (text: string) => void;
type ErrorLogger = (error: unknown, context?: string) => void;

/**
 * Process async stream with chunk callback
 */
export async function processStream(
  stream: AsyncIterable<StreamChunk>,
  onChunk: ChunkCallback,
  onError?: ErrorLogger
): Promise<string> {
  let fullText = "";

  for await (const chunk of stream) {
    // chunk.text() errors are critical (e.g. safety blocks mid-stream)
    // and must propagate, unlike callback errors which are safe to swallow
    const chunkText = chunk.text();
    if (chunkText) {
      fullText += chunkText;
      safeCallChunk(onChunk, chunkText, onError);
    }
  }

  return fullText;
}

/**
 * Safely call chunk callback without breaking the stream
 */
function safeCallChunk(
  callback: ChunkCallback,
  text: string,
  onError?: ErrorLogger
): void {
  try {
    callback(text);
  } catch (callbackError) {
    logError(onError, callbackError, "stream-callback");
  }
}

/**
 * Log error without breaking the stream
 */
function logError(
  onError: ErrorLogger | undefined,
  error: unknown,
  context?: string
): void {
  if (onError) {
    try {
      onError(error, context);
    } catch {
      // Silently ignore logger errors
    }
  }
}

