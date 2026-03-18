/**
 * API Key Value Object
 * Encapsulates API key validation and formatting
 */

export class ApiKey {
  private static readonly MIN_LENGTH = 10;
  private static readonly PREFIX = "AIza";

  private constructor(private readonly value: string) {}

  /**
   * Create a validated API key
   * @throws Error if validation fails
   */
  static create(value: string): ApiKey {
    const trimmed = value?.trim() || "";

    if (trimmed.length < ApiKey.MIN_LENGTH) {
      throw new Error(
        `API key must be at least ${ApiKey.MIN_LENGTH} characters`
      );
    }

    if (!trimmed.startsWith(ApiKey.PREFIX)) {
      throw new Error(
        `API key must start with "${ApiKey.PREFIX}"`
      );
    }

    return new ApiKey(trimmed);
  }

  /**
   * Get the API key value
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Check if API key equals another
   */
  equals(other: ApiKey): boolean {
    return this.value === other.value;
  }

  /**
   * Get masked version for logging (e.g., "AIza...xyz")
   */
  toMasked(): string {
    if (this.value.length <= 10) return "***";
    return `${this.value.substring(0, 6)}...${this.value.substring(this.value.length - 3)}`;
  }
}
