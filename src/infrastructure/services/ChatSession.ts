import type { ChatSession as SdkChatSession, Part } from "@google/generative-ai";
import { geminiClient } from "./GeminiClient";
import { DEFAULT_MODELS } from "../../domain/entities";
import type {
  GeminiChatConfig,
  GeminiContent,
  GeminiMessagePart,
} from "../../domain/entities";

/**
 * Creates a Gemini chat session with full support for system instructions,
 * safety settings, generation config, and multi-turn conversation history.
 *
 * Usage:
 * ```ts
 * const session = createChatSession({
 *   model: "gemini-2.5-flash",
 *   systemInstruction: "You are a helpful assistant.",
 *   generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
 *   history: geminiHistory,
 * });
 *
 * const text = await session.send([{ text: "Hello" }]);
 * ```
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
    /**
     * Send a message and return the full response text.
     * Accepts text parts and/or inline data parts (images, audio).
     */
    async send(parts: GeminiMessagePart[]): Promise<string> {
      const result = await chat.sendMessage(parts as Part[]);
      if (!result.response) throw new Error("No response from Gemini SDK");
      return result.response.text();
    },
  };
}
