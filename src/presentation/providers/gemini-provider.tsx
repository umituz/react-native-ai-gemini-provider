/**
 * Gemini Provider Component
 * React context provider for Gemini services
 */

import React, { createContext, useContext, useMemo, type ReactNode } from "react";
import { GeminiConfigBuilder } from "../../application/builders/config-builder";
import { geminiProvider } from "../../application/providers/gemini-provider";
import type { GeminiConfig } from "../../domain/entities";

interface GeminiContextValue {
  isInitialized: boolean;
  initialize: (config: GeminiConfig) => void;
  reset: () => void;
}

const GeminiContext = createContext<GeminiContextValue | undefined>(undefined);

export interface GeminiProviderProps {
  children: ReactNode;
  config?: GeminiConfig;
}

export function GeminiProviderComponent({
  children,
  config: initialConfig,
}: GeminiProviderProps) {
  const [isInitialized, setIsInitialized] = React.useState(false);

  const initialize = React.useCallback((config: GeminiConfig) => {
    geminiProvider.initialize(config);
    setIsInitialized(true);
  }, []);

  const reset = React.useCallback(() => {
    // Reset using the class directly
    const { GeminiProviderClass } = require("../../application/providers");
    GeminiProviderClass.reset();
    setIsInitialized(false);
  }, []);

  // Initialize with config if provided
  React.useEffect(() => {
    if (initialConfig && !isInitialized) {
      initialize(initialConfig);
    }
  }, [initialConfig, isInitialized, initialize]);

  const value = useMemo(
    () => ({
      isInitialized,
      initialize,
      reset,
    }),
    [isInitialized, initialize, reset]
  );

  return <GeminiContext.Provider value={value}>{children}</GeminiContext.Provider>;
}

/**
 * Hook to access Gemini context
 */
export function useGeminiContext(): GeminiContextValue {
  const context = useContext(GeminiContext);
  if (!context) {
    throw new Error("useGeminiContext must be used within GeminiProvider");
  }
  return context;
}

/**
 * Convenience hook to initialize with builder
 */
export function useGeminiInitializer() {
  const { initialize, isInitialized } = useGeminiContext();

  const initWithBuilder = React.useCallback(
    (builderOrConfig: GeminiConfigBuilder | GeminiConfig) => {
      const config =
        builderOrConfig instanceof GeminiConfigBuilder
          ? builderOrConfig.build()
          : builderOrConfig;
      initialize(config);
    },
    [initialize]
  );

  return {
    initialize: initWithBuilder,
    isInitialized,
  };
}
