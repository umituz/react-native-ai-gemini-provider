/**
 * Timeout Value Object
 * Encapsulates timeout duration validation
 */

export class Timeout {
  private static readonly MIN_MS = 1;
  private static readonly MAX_MS = 300000; // 5 minutes

  private constructor(private readonly valueMs: number) {}

  /**
   * Create a validated timeout in milliseconds
   * @throws Error if validation fails
   */
  static create(milliseconds: number): Timeout {
    const value = milliseconds ?? 30000; // Default 30s

    if (value < Timeout.MIN_MS || value > Timeout.MAX_MS) {
      throw new Error(
        `Timeout must be between ${Timeout.MIN_MS}ms and ${Timeout.MAX_MS}ms`
      );
    }

    return new Timeout(value);
  }

  /**
   * Create timeout in seconds
   */
  static fromSeconds(seconds: number): Timeout {
    return Timeout.create(seconds * 1000);
  }

  /**
   * Get timeout in milliseconds
   */
  toMilliseconds(): number {
    return this.valueMs;
  }

  /**
   * Get timeout in seconds
   */
  toSeconds(): number {
    return Math.round(this.valueMs / 1000);
  }

  /**
   * Check if this is a short timeout (< 10s)
   */
  isShort(): boolean {
    return this.valueMs < 10000;
  }

  /**
   * Check if this is a long timeout (> 60s)
   */
  isLong(): boolean {
    return this.valueMs > 60000;
  }

  /**
   * Check if timeout equals another
   */
  equals(other: Timeout): boolean {
    return this.valueMs === other.valueMs;
  }
}
