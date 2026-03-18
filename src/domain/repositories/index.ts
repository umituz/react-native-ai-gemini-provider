/**
 * Domain Repository Interfaces
 * Contracts for infrastructure implementations
 */

export type {
  ITextGenerationRepository,
  TextGenerationRequest,
} from "./text-generation.repository";

export type {
  IStreamingRepository,
  StreamingRequest,
} from "./streaming.repository";

export type {
  IStructuredTextRepository,
  StructuredGenerationRequest,
} from "./structured-text.repository";
