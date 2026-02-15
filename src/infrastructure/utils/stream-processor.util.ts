/**
 * Stream Processing Utilities
 * Reusable stream handling logic
 */

export interface StreamChunk {
  text: () => string;
}

export type ChunkCallback = (text: string) => void;
export type ErrorLogger = (error: unknown, context?: string) => void;

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
    try {
      const chunkText = chunk.text();
      if (chunkText) {
        fullText += chunkText;
        safeCallChunk(onChunk, chunkText, onError);
      }
    } catch (chunkError) {
      logError(onError, chunkError, "stream-chunk");
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

/**
 * Create a buffered stream processor
 * Accumulates chunks until a condition is met
 */
export class BufferedStreamProcessor {
  private buffer = "";
  private fullText = "";

  constructor(
    private onFlush: (text: string) => void,
    private flushCondition: (buffer: string) => boolean = () => false
  ) {}

  /**
   * Process a single chunk
   */
  processChunk(chunk: StreamChunk): void {
    try {
      const chunkText = chunk.text();
      if (!chunkText) return;

      this.buffer += chunkText;
      this.fullText += chunkText;

      if (this.flushCondition(this.buffer)) {
        this.flush();
      }
    } catch (error) {
      // Ignore chunk errors
    }
  }

  /**
   * Flush buffer to callback
   */
  flush(): void {
    if (this.buffer) {
      try {
        this.onFlush(this.buffer);
        this.buffer = "";
      } catch {
        // Ignore callback errors
      }
    }
  }

  /**
   * Get accumulated full text
   */
  getFullText(): string {
    return this.fullText;
  }

  /**
   * Process entire stream
   */
  async processStream(stream: AsyncIterable<StreamChunk>): Promise<string> {
    for await (const chunk of stream) {
      this.processChunk(chunk);
    }

    // Flush remaining buffer
    this.flush();

    return this.fullText;
  }
}

/**
 * Common flush conditions
 */
export const flushConditions = {
  /**
   * Flush on newline
   */
  onNewline: (buffer: string): boolean => buffer.includes("\n"),

  /**
   * Flush when buffer reaches size
   */
  onSize: (size: number) => (buffer: string): boolean => buffer.length >= size,

  /**
   * Flush on pattern match
   */
  onPattern: (pattern: RegExp) => (buffer: string): boolean => pattern.test(buffer),
};
