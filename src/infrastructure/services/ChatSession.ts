import type { ChatSession as SdkChatSession, Part } from "@google/generative-ai";
import { geminiClient } from "./GeminiClient";
import { DEFAULT_MODELS } from "../../domain/entities";
import type {
  GeminiChatConfig,
  GeminiGenerationConfig,
  GeminiContent,
  GeminiInlineDataPart,
  GeminiMessagePart,
  GeminiSafetySetting,
} from "../../domain/entities";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChatSendResult {
  text: string;
  finishReason?: string;
}

/** A simple chat message (user/assistant/system) */
export interface ChatHistoryMessage {
  readonly role: "user" | "assistant" | "system";
  readonly content: string;
}

/** Options for the high-level sendChatMessage() */
export interface SendChatMessageOptions {
  /** Conversation history */
  history: ChatHistoryMessage[];
  /** Current user message text */
  message: string;
  /** System instruction for the model */
  systemPrompt?: string;
  /** Model name (defaults to gemini-2.5-flash) */
  model?: string;
  /** Generation config (temperature, maxOutputTokens, etc.) */
  generationConfig?: GeminiGenerationConfig;
  /** Safety settings (defaults to BLOCK_NONE for all) */
  safetySettings?: GeminiSafetySetting[];
  /** Pre-built attachments (base64 inline data parts for images/audio) */
  attachments?: GeminiInlineDataPart[];
  /** Max character budget for history trimming (default 12000) */
  historyMaxChars?: number;
  /** Min messages to always keep regardless of budget (default 4) */
  historyMinMessages?: number;
}

// ─── MIME Utilities ──────────────────────────────────────────────────────────

const AUDIO_MIME: Record<string, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  flac: "audio/flac",
  aac: "audio/aac",
  mp4: "audio/mp4",
  m4a: "audio/mp4",
  caf: "audio/mp4",
  "3gp": "audio/3gpp",
};

/** Resolve MIME type for an audio file extension */
export function resolveAudioMimeType(extension: string): string {
  return AUDIO_MIME[extension.toLowerCase()] ?? "audio/mp4";
}

const IMAGE_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  heic: "image/heic",
  heif: "image/heif",
  bmp: "image/bmp",
};

/** Resolve MIME type for an image file extension */
export function resolveImageMimeType(extension: string): string {
  return IMAGE_MIME[extension.toLowerCase()] ?? "image/jpeg";
}

// ─── History Utilities ───────────────────────────────────────────────────────

/**
 * Converts chat messages (user/assistant/system) to Gemini SDK content format.
 * Skips system messages, merges consecutive same-role messages.
 */
export function buildChatHistory(
  history: readonly ChatHistoryMessage[],
): GeminiContent[] {
  const result: GeminiContent[] = [];
  let seenUser = false;

  for (const m of history) {
    if (m.role === "system") continue;
    if (!seenUser && m.role !== "user") continue;
    seenUser = true;

    const role = m.role === "assistant" ? "model" : "user";
    const last = result[result.length - 1];

    if (last && last.role === role) {
      // Merge by extracting all text from existing parts and appending new content
      const existingText = last.parts
        .map((p) => ("text" in p ? (p.text ?? "") : ""))
        .filter(Boolean)
        .join("");
      last.parts = [{ text: existingText + "\n" + m.content }];
    } else {
      result.push({ role, parts: [{ text: m.content }] });
    }
  }

  return result;
}

/**
 * Trims conversation history to fit within a character budget.
 * Keeps at least `minMessages` entries regardless of budget.
 */
export function trimChatHistory(
  history: ChatHistoryMessage[],
  maxChars = 12000,
  minMessages = 4,
): ChatHistoryMessage[] {
  if (history.length <= minMessages) return history;

  let totalChars = 0;
  const trimmed: ChatHistoryMessage[] = [];

  for (let i = history.length - 1; i >= 0; i--) {
    const chars = history[i].content.length;
    if (trimmed.length >= minMessages && totalChars + chars > maxChars) break;
    trimmed.unshift(history[i]);
    totalChars += chars;
  }

  return trimmed;
}

// ─── Low-level: createChatSession ────────────────────────────────────────────

/**
 * Creates a Gemini chat session with full support for system instructions,
 * safety settings, generation config, and multi-turn conversation history.
 */
export function createChatSession(config: GeminiChatConfig = {}) {
  const model = geminiClient.getModel({
    model: config.model ?? DEFAULT_MODELS.CHAT,
    systemInstruction: config.systemInstruction,
    safetySettings: config.safetySettings,
  });

  const historyForChat = (config.history ?? []).map((turn) => ({
    role: turn.role === "model" ? ("model" as const) : ("user" as const),
    parts: turn.parts as Part[],
  }));

  const chat: SdkChatSession = model.startChat({
    history: historyForChat,
    ...(config.generationConfig && { generationConfig: config.generationConfig }),
  });

  return {
    async send(parts: GeminiMessagePart[]): Promise<ChatSendResult> {
      if (__DEV__) {
        console.log("[ChatSession.send] >>> SENDING TO GEMINI SDK");
        console.log("[ChatSession.send] parts count:", parts.length);
        parts.forEach((p, i) => {
          if ("text" in p) console.log(`[ChatSession.send] part[${i}] text:`, (p.text ?? "").substring(0, 200));
          if ("inlineData" in p) console.log(`[ChatSession.send] part[${i}] inlineData: mime=${(p as GeminiInlineDataPart).inlineData.mimeType}, size=${(p as GeminiInlineDataPart).inlineData.data.length}`);
        });
      }

      const result = await chat.sendMessage(parts as Part[]);
      if (!result.response) throw new Error("No response from Gemini SDK");
      const candidate = result.response.candidates?.[0];

      // SDK's text() throws on safety-blocked responses with no text
      let text: string;
      try {
        text = result.response.text();
      } catch {
        if (String(candidate?.finishReason) === "SAFETY") {
          throw new Error("Response blocked by safety filter.");
        }
        throw new Error("No text content in response");
      }

      if (__DEV__) {
        console.log("[ChatSession.send] <<< GEMINI SDK RESPONSE");
        console.log("[ChatSession.send] finishReason:", candidate?.finishReason ?? "N/A");
        console.log("[ChatSession.send] safetyRatings:", JSON.stringify(candidate?.safetyRatings ?? []));
        console.log("[ChatSession.send] response text length:", text.length);
        console.log("[ChatSession.send] response text:", text.substring(0, 500));
        console.log("[ChatSession.send] response FULL text:", text);
      }

      return {
        text,
        finishReason: candidate?.finishReason,
      };
    },
  };
}

// ─── High-level: sendChatMessage ─────────────────────────────────────────────

/**
 * All-in-one: trims history, builds session, sends message, handles safety.
 * Returns the AI response text.
 *
 * ```ts
 * const text = await sendChatMessage({
 *   history: messages,
 *   message: "hello",
 *   systemPrompt: "You are Aria...",
 *   model: GEMINI_MODELS.TEXT.FLASH,
 *   generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
 * });
 * ```
 */
export async function sendChatMessage(
  opts: SendChatMessageOptions,
): Promise<string> {
  if (!opts.message || opts.message.trim().length === 0) {
    throw new Error("Message cannot be empty");
  }

  if (__DEV__) {
    console.log("═══════════════════════════════════════════════════");
    console.log("[sendChatMessage] >>> START");
    console.log("[sendChatMessage] model:", opts.model ?? DEFAULT_MODELS.CHAT);
    console.log("[sendChatMessage] message:", opts.message.substring(0, 200));
    console.log("[sendChatMessage] history count:", opts.history.length);
    console.log("[sendChatMessage] systemPrompt length:", opts.systemPrompt?.length ?? 0);
    console.log("[sendChatMessage] systemPrompt (first 500):", opts.systemPrompt?.substring(0, 500));
    console.log("[sendChatMessage] generationConfig:", JSON.stringify(opts.generationConfig));
    console.log("[sendChatMessage] safetySettings:", opts.safetySettings ? JSON.stringify(opts.safetySettings) : "USING DEFAULT (BLOCK_NONE)");
    console.log("[sendChatMessage] attachments:", opts.attachments?.length ?? 0);
  }

  const trimmed = trimChatHistory(
    opts.history,
    opts.historyMaxChars,
    opts.historyMinMessages,
  );

  if (__DEV__) {
    console.log("[sendChatMessage] history after trim:", trimmed.length, "messages");
    trimmed.forEach((m, i) => console.log(`[sendChatMessage] history[${i}]: role=${m.role}, content=${m.content.substring(0, 100)}`));
  }

  const geminiHistory = buildChatHistory(trimmed);

  if (__DEV__) {
    console.log("[sendChatMessage] geminiHistory (SDK format):", geminiHistory.length, "turns");
    geminiHistory.forEach((h, i) => {
      const text = "text" in h.parts[0] ? (h.parts[0] as { text: string }).text : "[non-text]";
      console.log(`[sendChatMessage] geminiHistory[${i}]: role=${h.role}, text=${text.substring(0, 100)}`);
    });
  }

  const session = createChatSession({
    model: opts.model ?? DEFAULT_MODELS.CHAT,
    systemInstruction: opts.systemPrompt,
    safetySettings: opts.safetySettings,
    generationConfig: opts.generationConfig,
    history: geminiHistory,
  });

  const parts: GeminiMessagePart[] = [{ text: opts.message }];
  if (opts.attachments) {
    parts.push(...opts.attachments);
  }

  const result = await session.send(parts);

  if (__DEV__) {
    console.log("[sendChatMessage] finishReason:", result.finishReason);
    console.log("[sendChatMessage] response text length:", result.text.length);
    console.log("[sendChatMessage] response FULL:", result.text);
    console.log("[sendChatMessage] <<< END");
    console.log("═══════════════════════════════════════════════════");
  }

  if (result.finishReason === "SAFETY") {
    if (__DEV__) console.warn("[sendChatMessage] ⚠️ SAFETY FILTER TRIGGERED but has text, returning partial");
    if (result.text.trim()) return result.text;
    throw new Error("Response blocked by safety filter.");
  }

  return result.text;
}
