/**
 * Content Mapper
 * Transforms between domain and SDK content formats
 */

import type { Part } from "@google/generative-ai";
import type { GeminiContent, GeminiPart } from "../../domain/entities";

export class ContentMapper {
  /**
   * Convert domain content to SDK format
   */
  toSdk(content: GeminiContent): { role: string; parts: Part[] } {
    return {
      role: content.role || "user",
      parts: content.parts.map(this.mapPartToSdk),
    };
  }

  /**
   * Convert domain content array to SDK format
   */
  toSdkArray(contents: GeminiContent[]): Array<{ role: string; parts: Part[] }> {
    return contents.map((c) => this.toSdk(c));
  }

  /**
   * Convert SDK content to domain format
   */
  toDomain(sdk: { role: string; parts: Part[] }): GeminiContent {
    return {
      role: sdk.role as "user" | "model",
      parts: sdk.parts.map(this.mapSdkPartToDomain),
    };
  }

  /**
   * Map a single domain part to SDK format
   */
  private mapPartToSdk(part: GeminiPart): Part {
    if ("text" in part) {
      return { text: part.text };
    }
    if ("inlineData" in part) {
      return { inlineData: part.inlineData };
    }
    throw new Error("Unknown part type");
  }

  /**
   * Map a single SDK part to domain format
   */
  private mapSdkPartToDomain(part: Part): GeminiPart {
    if ("text" in part && typeof part.text === "string") {
      return { text: part.text };
    }
    if ("inlineData" in part) {
      return { inlineData: part.inlineData };
    }
    return { text: "" };
  }

  /**
   * Create a simple text content
   */
  createTextContent(text: string, role: "user" | "model" = "user"): GeminiContent {
    return {
      parts: [{ text }],
      role,
    };
  }

  /**
   * Extract text from content parts
   */
  extractText(parts: GeminiPart[] | undefined): string {
    if (!parts || parts.length === 0) return "";
    return parts.map((p) => ("text" in p ? (p.text || "") : "")).join("");
  }
}
