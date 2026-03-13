import type { ChatSession as SdkChatSession, Part } from "@google/generative-ai";
import { geminiClient } from "./GeminiClient";
import { DEFAULT_MODELS } from "../../domain/entities";
import { trimArrayByCharBudget } from "../utils/text-calculations.util";
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
      // Optimized: reduce instead of map + filter + join
      const existingText = last.parts.reduce((acc, p) => acc + ("text" in p ? p.text : ""), "");
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
  return trimArrayByCharBudget(
    history,
    (m) => m.content.length,
    maxChars,
    minMessages,
  );
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

  const trimmed = trimChatHistory(
    opts.history,
    opts.historyMaxChars,
    opts.historyMinMessages,
  );

  const geminiHistory = buildChatHistory(trimmed);

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

  if (result.finishReason === "SAFETY") {
    if (result.text.trim()) return result.text;
    throw new Error("Response blocked by safety filter.");
  }

  return result.text;
}
