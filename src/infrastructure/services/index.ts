/**
 * Infrastructure Services
 */

// Core services (low-level SDK wrappers)
export { geminiClientCoreService } from "./gemini-client-core.service";
export { geminiRetryService } from "./gemini-retry.service";
export { geminiTextGenerationService } from "./gemini-text-generation.service";
export { geminiStructuredTextService } from "./gemini-structured-text.service";
export { geminiImageGenerationService } from "./gemini-image-generation.service";
export { geminiImageEditService } from "./gemini-image-edit.service";
export { geminiStreamingService } from "./gemini-streaming.service";
export { geminiVideoGenerationService } from "./gemini-video-generation.service";

// Modular services
export { providerInitializer } from "./provider-initializer";
export { jobProcessor } from "./job-processor";
export { generationExecutor } from "./generation-executor";
export { featureModelSelector } from "./feature-model-selector";

// Public provider API
export {
  geminiProviderService,
  createGeminiProvider,
  GeminiProvider,
} from "./gemini-provider";

export type { GeminiProviderConfig } from "./gemini-provider";
export type { GeminiProviderConfig as AIProviderConfig } from "./provider-initializer";

// Generation executor types
export type {
  GenerationInput,
  GenerationResult,
  ExecutionOptions,
} from "./generation-executor";

// Retry service types
export type { RetryOptions } from "./gemini-retry.service";

// Re-export types from generation-content for convenience
export type {
  IAIProvider,
  JobSubmission,
  JobStatus,
  SubscribeOptions,
  AIJobStatusType,
} from "@umituz/react-native-ai-generation-content";
