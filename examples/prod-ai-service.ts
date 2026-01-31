/**
 * Production Ready AI Service Example
 * 
 * This example demonstrates real API usage with proper error handling,
 * caching, rate limiting, and type-safe responses.
 */

import {
  geminiClientCoreService,
  geminiTextService,
  geminiStructuredTextService,
  rateLimiter,
  SimpleCache,
  type GeminiGenerationConfig,
} from "@umituz/react-native-ai-gemini-provider";

const DEFAULT_MODEL = "gemini-2.5-flash-lite";
const CACHE_PREFIX = "ai_cache_";
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

const analysisCache = new SimpleCache<string, unknown>({ 
  maxSize: 50, 
  ttl: CACHE_TTL 
});

function ensureInitialized(): void {
  if (!geminiClientCoreService.isInitialized()) {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Gemini API key is not configured. Set EXPO_PUBLIC_GEMINI_API_KEY in .env"
      );
    }
    geminiClientCoreService.initialize({
      apiKey,
      textModel: DEFAULT_MODEL,
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
    });
  }
}

function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = ((hash << 5) - hash) + content.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export interface AnalysisResult {
  score: number;
  feedback: string;
  suggestions: string[];
}

const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    score: { 
      type: "number", 
      description: "Score between 0-100" 
    },
    feedback: { 
      type: "string", 
      description: "Overall feedback" 
    },
    suggestions: {
      type: "array",
      items: { type: "string" },
      description: "List of improvement suggestions",
    },
  },
  required: ["score", "feedback", "suggestions"],
};

export async function analyzeContent(content: string): Promise<AnalysisResult> {
  ensureInitialized();

  const cacheKey = CACHE_PREFIX + hashContent(content);
  const cached = analysisCache.get(cacheKey);
  if (cached) {
    return cached as AnalysisResult;
  }

  const prompt = `Analyze following content and provide feedback:
  
${content}`;

  const result = await rateLimiter.execute(() =>
    geminiStructuredTextService.generateStructuredText<AnalysisResult>(
      DEFAULT_MODEL,
      prompt,
      ANALYSIS_SCHEMA,
    ),
  );

  analysisCache.set(cacheKey, result);
  return result;
}

export async function generateText(prompt: string): Promise<string> {
  ensureInitialized();
  return rateLimiter.execute(() =>
    geminiTextService.generateText(DEFAULT_MODEL, prompt),
  );
}

export interface LetterAnalysis {
  academicToneScore: number;
  completenessScore: number;
  suggestions: string[];
  improvedDraft: string;
}

const LETTER_SCHEMA = {
  type: "object",
  properties: {
    academicToneScore: { type: "number" },
    completenessScore: { type: "number" },
    suggestions: { type: "array", items: { type: "string" } },
    improvedDraft: { type: "string" },
  },
  required: ["academicToneScore", "completenessScore", "suggestions", "improvedDraft"],
};

export async function analyzeMotivationLetter(
  content: string,
): Promise<LetterAnalysis> {
  ensureInitialized();

  const prompt = `Analyze this motivation letter for university application.
Evaluate academic tone (formal language, professional vocabulary) and completeness.
Return scores 0-100 and provide specific improvement suggestions.
Also provide an improved version of draft.

Letter:
${content}`;

  return rateLimiter.execute(() =>
    geminiStructuredTextService.generateStructuredText<LetterAnalysis>(
      DEFAULT_MODEL,
      prompt,
      LETTER_SCHEMA,
    ),
  );
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function chat(
  messages: ChatMessage[],
  userMessage: string,
): Promise<string> {
  ensureInitialized();

  const conversationHistory = messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const prompt = `You are a helpful assistant. Continue this conversation:

${conversationHistory}
User: ${userMessage}
Assistant:`;

  return rateLimiter.execute(() =>
    geminiTextService.generateText(DEFAULT_MODEL, prompt),
  );
}

export async function summarizeText(
  text: string,
  maxSentences: number = 3,
): Promise<string> {
  ensureInitialized();

  const prompt = `Summarize following text in ${maxSentences} sentences or less.
Be concise and capture the main points:

${text}`;

  return rateLimiter.execute(() =>
    geminiTextService.generateText(DEFAULT_MODEL, prompt),
  );
}

export async function batchAnalyze(
  items: string[],
): Promise<AnalysisResult[]> {
  ensureInitialized();

  const prompt = `Analyze each of following items separately:

${items.map((item, i) => `[${i + 1}] ${item}`).join("\n\n")}

Return a JSON array with analysis for each item.`;

  return rateLimiter.execute(() =>
    geminiStructuredTextService.generateStructuredText<AnalysisResult[]>(
      DEFAULT_MODEL,
      prompt,
      { type: "array", items: ANALYSIS_SCHEMA },
    ),
  );
}

export async function safeAnalyze(
  content: string,
): Promise<AnalysisResult | null> {
  try {
    return await analyzeContent(content);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        console.error("Gemini API key is missing or invalid");
        return null;
      }

      if (error.message.includes("429") || error.message.includes("quota")) {
        console.error("Rate limit exceeded. Waiting before retry...");
        await new Promise((r) => setTimeout(r, 5000));
        return safeAnalyze(content);
      }

      console.error("AI analysis failed:", error.message);
    }
    return null;
  }
}

export function clearCache(): void {
  analysisCache.clear();
}

export function getCacheStats() {
  return analysisCache.getStats();
}
