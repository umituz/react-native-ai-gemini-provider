export { geminiClient } from "./GeminiClient";
export { textGeneration } from "./TextGeneration";
export { structuredText } from "./StructuredText";
export { streaming } from "./Streaming";
export { geminiProvider, GeminiProvider } from "./GeminiProvider";
export {
  createChatSession,
  sendChatMessage,
  buildChatHistory,
  trimChatHistory,
  resolveAudioMimeType,
  resolveImageMimeType,
  type ChatSendResult,
  type ChatHistoryMessage,
  type SendChatMessageOptions,
} from "./ChatSession";
