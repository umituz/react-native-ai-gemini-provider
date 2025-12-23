/**
 * Provider Configuration & Factory
 * Centralized configuration system for tier-based AI provider setup
 */

export {
  resolveProviderConfig,
  getCostOptimizedConfig,
  getQualityOptimizedConfig,
} from "./ProviderConfig";

export type {
  SubscriptionTier,
  QualityPreference,
  ProviderPreferences,
  ProviderConfigInput,
  ResolvedProviderConfig,
} from "./ProviderConfig";

export { providerFactory } from "./ProviderFactory";

export type {
  OptimizationStrategy,
  ProviderFactoryOptions,
} from "./ProviderFactory";
