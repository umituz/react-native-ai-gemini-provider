/**
 * Validation Composers
 * Composable validation rules for clean, reusable validation
 */

export type ValidationRule<T = unknown> = (value: T) => string | null;

/**
 * Compose multiple validation rules into one
 */
export function compose<T>(...rules: ValidationRule<T>[]): ValidationRule<T> {
  return (value: T): string | null => {
    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  };
}

/**
 * Validate that value is not empty
 */
export function required(fieldName: string = "Field"): ValidationRule<string> {
  return (value: string): string | null => {
    if (!value || typeof value !== "string" || value.trim().length === 0) {
      return `${fieldName} is required`;
    }
    return null;
  };
}

/**
 * Validate minimum length
 */
export function minLength(min: number, fieldName: string = "Field"): ValidationRule<string> {
  return (value: string): string | null => {
    if (value.trim().length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return null;
  };
}

/**
 * Validate maximum length
 */
export function maxLength(max: number, fieldName: string = "Field"): ValidationRule<string> {
  return (value: string): string | null => {
    if (value.length > max) {
      return `${fieldName} must be at most ${max} characters`;
    }
    return null;
  };
}

/**
 * Validate string starts with prefix
 */
export function startsWith(prefix: string, fieldName: string = "Field"): ValidationRule<string> {
  return (value: string): string | null => {
    if (!value.startsWith(prefix)) {
      return `${fieldName} must start with "${prefix}"`;
    }
    return null;
  };
}

/**
 * Validate number is in range
 */
export function inRange(min: number, max: number, fieldName: string = "Value"): ValidationRule<number> {
  return (value: number): string | null => {
    if (typeof value !== "number" || value < min || value > max) {
      return `${fieldName} must be between ${min} and ${max}`;
    }
    return null;
  };
}

/**
 * Validate object has required properties
 */
export function hasProperties(...props: string[]): ValidationRule<Record<string, unknown>> {
  return (value: Record<string, unknown>): string | null => {
    const missing = props.filter((prop) => !(prop in value) || value[prop] === undefined);
    if (missing.length > 0) {
      return `Missing required properties: ${missing.join(", ")}`;
    }
    return null;
  };
}

/**
 * Validate object structure (for schemas)
 */
export function isValidSchema(): ValidationRule<Record<string, unknown>> {
  return compose(
    (schema): string | null => {
      if (!schema || typeof schema !== "object") {
        return "Schema must be a non-empty object";
      }
      return null;
    },
    (schema): string | null => {
      if (Object.keys(schema).length === 0) {
        return "Schema must contain at least one property";
      }
      return null;
    },
    hasProperties("type"),
    (schema): string | null => {
      const schemaType = schema.type;
      if (schemaType !== "object" && schemaType !== "array") {
        return `Schema type must be "object" or "array", got "${String(schemaType)}"`;
      }
      return null;
    },
    (schema): string | null => {
      if (schema.type === "object" && !("properties" in schema)) {
        return 'Object schema must have a "properties" field';
      }
      return null;
    }
  );
}

/**
 * Helper to validate and throw on error
 */
export function validateOrThrow<T>(value: T, rule: ValidationRule<T>): void {
  const error = rule(value);
  if (error) {
    throw new Error(error);
  }
}

/**
 * Pre-built composite validators
 */
export const validators = {
  apiKey: compose(
    required("API key"),
    minLength(10, "API key")
  ),

  modelName: compose(
    required("Model name"),
    startsWith("gemini-", "Model name")
  ),

  prompt: compose(
    required("Prompt"),
    minLength(3, "Prompt")
  ),

  timeout: inRange(1, 300000, "Timeout"),

  schema: isValidSchema(),
};
