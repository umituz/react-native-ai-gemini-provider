/**
 * Veo HTTP Client
 * Handles HTTP requests to Google Veo API
 */

import { createVideoError } from "./gemini-video-error";
import type { VeoOperation } from "../../domain/entities";

const VEO_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

class VeoHttpClient {
  /**
   * Start a text-to-video operation
   */
  async startOperation(
    model: string,
    apiKey: string,
    instances: Record<string, unknown>[],
    parameters: Record<string, unknown>,
  ): Promise<VeoOperation> {
    const url = `${VEO_API_BASE}/models/${model}:predictLongRunning`;
    const body = { instances, parameters };

    return this.postRequest(url, body, apiKey);
  }

  /**
   * Fetch operation status
   */
  async fetchOperationStatus(operationName: string, apiKey: string): Promise<VeoOperation> {
    const url = `${VEO_API_BASE}/${operationName}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "x-goog-api-key": apiKey },
    });

    if (!res.ok) {
      throw createVideoError("NETWORK", `Polling error: ${await res.text()}`, res.status);
    }

    return res.json() as Promise<VeoOperation>;
  }

  /**
   * Generic POST request
   */
  private async postRequest(
    url: string,
    body: Record<string, unknown>,
    apiKey: string,
  ): Promise<VeoOperation> {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw createVideoError("OPERATION_FAILED", `Veo API error: ${await res.text()}`, res.status);
    }

    return res.json() as Promise<VeoOperation>;
  }
}

export const veoHttpClient = new VeoHttpClient();
