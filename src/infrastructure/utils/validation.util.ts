/**
 * Validation Utilities
 * Common validation logic for models, configurations, and inputs
 */

/** Maximum timeout value (5 minutes) */
const MAX_TIMEOUT_MS = 300000;

/** Minimum prompt length */
const MIN_PROMPT_LENGTH = 3;

/**
 * Validate model name format
 * @throws Error if model name is invalid
 */
export function validateModelName(modelName: string): void {
  if (!modelName || typeof modelName !== "string" || modelName.trim().length === 0) {
    const displayName: string = modelName === null ? "null" : typeof modelName;
    throw new Error(
      `Invalid model name: "${displayName}". Model name must be a non-empty string.`
    );
  }

  // Check for valid model format (starts with gemini-)
  if (!modelName.startsWith("gemini-")) {
    throw new Error(
      `Invalid model name: "${modelName}". Gemini models should start with "gemini-".`
    );
  }
}

/**
 * Validate API key format
 * @throws Error if API key is invalid
 */
export function validateApiKey(apiKey: string): void {
  if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
    throw new Error("API key must be a non-empty string");
  }

  // Gemini API keys typically start with "AIza"
  // This is a soft validation - actual validation happens on the API side
  const trimmedKey = apiKey.trim();
  if (trimmedKey.length < 10) {
    throw new Error("API key appears to be invalid (too short)");
  }
}

/**
 * Validate schema object for structured generation
 * @throws Error if schema is invalid
 */
export function validateSchema(schema: Record<string, unknown>): void {
  if (!schema || typeof schema !== "object") {
    throw new Error("Schema must be a non-empty object");
  }

  if (Object.keys(schema).length === 0) {
    throw new Error("Schema must contain at least one property");
  }

  // Basic structure validation - schema should have type
  if (!("type" in schema)) {
    throw new Error('Schema must have a "type" property (e.g., "object")');
  }

  const schemaType = schema.type;

  if (schemaType !== "object" && schemaType !== "array") {
    const typeStr = String(schemaType);
    throw new Error(`Schema type must be "object" or "array", got "${typeStr}"`);
  }

  // If type is object, should have properties
  if (schemaType === "object" && !("properties" in schema)) {
    throw new Error('Object schema must have a "properties" field');
  }
}

/**
 * Validate prompt text
 * @throws Error if prompt is invalid
 */
export function validatePrompt(prompt: string): void {
  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    throw new Error("Prompt must be a non-empty string");
  }

  if (prompt.trim().length < MIN_PROMPT_LENGTH) {
    throw new Error(`Prompt is too short (minimum ${MIN_PROMPT_LENGTH} characters)`);
  }
}

/**
 * Validate timeout value
 * @throws Error if timeout is invalid
 */
export function validateTimeout(timeout: number): void {
  if (typeof timeout !== "number" || timeout <= 0) {
    throw new Error("Timeout must be a positive number");
  }

  if (timeout > MAX_TIMEOUT_MS) {
    throw new Error(`Timeout cannot exceed ${MAX_TIMEOUT_MS}ms (5 minutes)`);
  }
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
