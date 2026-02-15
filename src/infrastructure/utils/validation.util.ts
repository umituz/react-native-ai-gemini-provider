/**
 * Validation Utilities (Legacy)
 * Maintained for backward compatibility
 * New code should use validation-composer.util.ts
 */

import { validateOrThrow, validators } from "./validation-composer.util";

/**
 * Validate model name format
 * @throws Error if model name is invalid
 */
export function validateModelName(modelName: string): void {
  validateOrThrow(modelName, validators.modelName);
}

/**
 * Validate API key format
 * @throws Error if API key is invalid
 */
export function validateApiKey(apiKey: string): void {
  validateOrThrow(apiKey, validators.apiKey);
}

/**
 * Validate schema object for structured generation
 * @throws Error if schema is invalid
 */
export function validateSchema(schema: Record<string, unknown>): void {
  validateOrThrow(schema, validators.schema);
}

/**
 * Validate prompt text
 * @throws Error if prompt is invalid
 */
export function validatePrompt(prompt: string): void {
  validateOrThrow(prompt, validators.prompt);
}

/**
 * Validate timeout value
 * @throws Error if timeout is invalid
 */
export function validateTimeout(timeout: number): void {
  validateOrThrow(timeout, validators.timeout);
}

/**
 * Check if a value is a valid object
 */
export function isValidObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length > 0
  );
}

/**
 * Validate required fields in an object
 */
export function validateRequiredFields(
  obj: Record<string, unknown>,
  requiredFields: string[]
): void {
  const missing = requiredFields.filter((field) => !(field in obj) || obj[field] === undefined);

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }
}
