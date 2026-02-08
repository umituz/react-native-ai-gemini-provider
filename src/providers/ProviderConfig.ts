
import { DEFAULT_MODELS } from "../domain/entities";

export interface ProviderPreferences {
  /** Request timeout (ms) */
  timeout?: number;
}

export interface ProviderConfigInput {
  /** API key for authentication */
  apiKey: string;
  /** Optional user preferences */
  preferences?: ProviderPreferences;
}

export interface ResolvedProviderConfig {
  apiKey: string;
  textModel: string;
  timeout: number;
}

const DEFAULTS = {
  timeout: 30000,
};

export function resolveProviderConfig(
  input: ProviderConfigInput,
): ResolvedProviderConfig {
  const preferences = input.preferences || {};

  return {
    apiKey: input.apiKey,
    textModel: DEFAULT_MODELS.TEXT,
    timeout: preferences.timeout ?? DEFAULTS.timeout,
  };
}
