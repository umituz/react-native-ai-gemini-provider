/**
 * Domain Validation Service
 * Pure validation functions for domain entities
 */

import type { GeminiContent } from "../entities";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ValidationService {
  /**
   * Validate prompt text
   */
  validatePrompt(prompt: string): void {
    if (!prompt || typeof prompt !== "string") {
      throw new ValidationError("Prompt must be a string");
    }

    const trimmed = prompt.trim();
    if (trimmed.length < 3) {
      throw new ValidationError("Prompt must be at least 3 characters");
    }

    if (trimmed.length > 100000) {
      throw new ValidationError("Prompt too long (max 100k characters)");
    }
  }

  /**
   * Validate JSON schema object
   */
  validateSchema(schema: unknown): void {
    if (!schema || typeof schema !== "object") {
      throw new ValidationError("Schema must be an object");
    }

    if (Array.isArray(schema)) {
      throw new ValidationError("Schema cannot be an array");
    }

    const keys = Object.keys(schema);
    if (keys.length === 0) {
      throw new ValidationError("Schema cannot be empty");
    }

    // Recursively validate nested schema properties
    for (const value of Object.values(schema)) {
      if (typeof value === "object" && value !== null) {
        this.validateSchema(value);
      }
    }
  }

  /**
   * Validate contents array
   */
  validateContents(contents: GeminiContent[]): void {
    if (!Array.isArray(contents)) {
      throw new ValidationError("Contents must be an array");
    }

    if (contents.length === 0) {
      throw new ValidationError("Contents cannot be empty");
    }

    if (contents.length > 1000) {
      throw new ValidationError("Too many content items (max 1000)");
    }

    // Validate each content item
    for (const content of contents) {
      this.validateContent(content);
    }
  }

  /**
   * Validate single content item
   */
  private validateContent(content: GeminiContent): void {
    if (!content.role || typeof content.role !== "string") {
      throw new ValidationError("Content role is required");
    }

    if (!content.parts || !Array.isArray(content.parts)) {
      throw new ValidationError("Content parts must be an array");
    }

    if (content.parts.length === 0) {
      throw new ValidationError("Content parts cannot be empty");
    }

    // Validate each part
    for (const part of content.parts) {
      const hasText = "text" in part && typeof part.text === "string" && part.text.length > 0;
      const hasInlineData = "inlineData" in part && part.inlineData !== null;

      if (!hasText && !hasInlineData) {
        throw new ValidationError("Each part must have text or inlineData");
      }
    }
  }

  /**
   * Validate model name
   */
  validateModelName(model: string): void {
    if (!model || typeof model !== "string") {
      throw new ValidationError("Model name is required");
    }

    if (!model.startsWith("gemini-")) {
      throw new ValidationError("Model name must start with 'gemini-'");
    }
  }

  /**
   * Validate callback function
   */
  validateCallback(callback: unknown, name: string): void {
    if (typeof callback !== "function") {
      throw new ValidationError(`${name} must be a function`);
    }
  }

  /**
   * Validate generation config
   */
  validateConfig(config: unknown): void {
    if (!config) return; // Config is optional

    if (typeof config !== "object" || Array.isArray(config)) {
      throw new ValidationError("Config must be an object");
    }

    // Validate temperature if present
    const cfg = config as Record<string, unknown>;
    if (cfg.temperature !== undefined) {
      const temp = cfg.temperature as number;
      if (typeof temp !== "number" || temp < 0 || temp > 2) {
        throw new ValidationError("Temperature must be between 0 and 2");
      }
    }

    // Validate max output tokens if present
    if (cfg.maxOutputTokens !== undefined) {
      const tokens = cfg.maxOutputTokens as number;
      if (typeof tokens !== "number" || tokens < 1 || tokens > 8192) {
        throw new ValidationError("maxOutputTokens must be between 1 and 8192");
      }
    }
  }
}
