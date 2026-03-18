/**
 * Model Name Value Object
 * Encapsulates Gemini model name validation
 */

export class ModelName {
  private static readonly PREFIX = "gemini-";

  private constructor(private readonly value: string) {}

  /**
   * Create a validated model name
   * @throws Error if validation fails
   */
  static create(value: string): ModelName {
    const trimmed = value?.trim() || "";

    if (!trimmed) {
      throw new Error("Model name cannot be empty");
    }

    if (!trimmed.startsWith(ModelName.PREFIX)) {
      throw new Error(
        `Model name must start with "${ModelName.PREFIX}"`
      );
    }

    return new ModelName(trimmed);
  }

  /**
   * Get the model name value
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Check if this is a Flash model (faster, cheaper)
   */
  isFlash(): boolean {
    return this.value.includes("flash");
  }

  /**
   * Check if this is a Pro model (higher quality)
   */
  isPro(): boolean {
    return this.value.includes("pro");
  }

  /**
   * Get model family (e.g., "gemini-2.5-flash" -> "2.5")
   */
  getVersion(): string {
    const match = this.value.match(/gemini-([\d.]+)/);
    return match ? match[1] : "unknown";
  }

  /**
   * Check if model name equals another
   */
  equals(other: ModelName): boolean {
    return this.value === other.value;
  }
}
