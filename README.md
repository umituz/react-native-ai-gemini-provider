# @umituz/react-native-ai-gemini-provider

Production-ready Google Gemini AI provider for React Native applications with built-in error handling, rate limiting, and caching.

## Features

- ✅ **Production Ready** - Real API integration with proper error handling
- ✅ **Type-Safe** - Full TypeScript support with structured output
- ✅ **Cost Optimized** - Uses `gemini-2.5-flash-lite` by default (1000 free requests/day)
- ✅ **Rate Limiting** - Built-in rate limiter to prevent API throttling
- ✅ **Caching** - LRU cache with TTL for performance optimization
- ✅ **Retry Logic** - Exponential backoff with jitter for resilient API calls
- ✅ **No Mock Data** - Production-grade implementation

## Installation

```bash
npm install @umituz/react-native-ai-gemini-provider
npm install @google/generative-ai
```

## Configuration

### 1. Get API Key

Visit [Google AI Studio](https://aistudio.google.com/apikey) and create an API key.

### 2. Environment Setup

Create `.env` file:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### 3. Initialize Provider

```typescript
import { geminiClientCoreService } from '@umituz/react-native-ai-gemini-provider';

geminiClientCoreService.initialize({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
  textModel: 'gemini-2.5-flash-lite',
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
});
```

## Usage

### Simple Text Generation

```typescript
import { geminiTextService } from '@umituz/react-native-ai-gemini-provider';

const response = await geminiTextService.generateText(
  'gemini-2.5-flash-lite',
  'Write a short greeting in Turkish'
);
console.log(response); // "Merhaba! Bugün size nasıl yardımcı olabilirim?"
```

### Structured Output (JSON)

```typescript
import { geminiStructuredTextService } from '@umituz/react-native-ai-gemini-provider';

interface AnalysisResult {
  score: number;
  feedback: string;
  suggestions: string[];
}

const schema = {
  type: 'object',
  properties: {
    score: { type: 'number' },
    feedback: { type: 'string' },
    suggestions: { type: 'array', items: { type: 'string' } },
  },
  required: ['score', 'feedback', 'suggestions'],
};

const result = await geminiStructuredTextService.generateStructuredText<AnalysisResult>(
  'gemini-2.5-flash-lite',
  'Analyze this text',
  schema
);

console.log(result.score); // 85
console.log(result.feedback); // "Good quality overall..."
```

### With Rate Limiting & Caching

```typescript
import { 
  geminiTextService, 
  rateLimiter,
  SimpleCache 
} from '@umituz/react-native-ai-gemini-provider';

const cache = new SimpleCache<string, string>({ 
  maxSize: 50, 
  ttl: 60000 // 1 minute 
});

const cacheKey = `text_${prompt}`;
const cached = cache.get(cacheKey);

if (cached) {
  return cached;
}

const response = await rateLimiter.execute(() =>
  geminiTextService.generateText('gemini-2.5-flash-lite', prompt)
);

cache.set(cacheKey, response);
return response;
```

## Production Example

See `examples/prod-ai-service.ts` for a complete production-ready implementation with:

- ✅ Content analysis
- ✅ Motivation letter analysis
- ✅ Chat assistant
- ✅ Text summarization
- ✅ Batch processing
- ✅ Error handling with retry

## Models

| Model | Input | Output | Free/Day | Best For |
|-------|-------|--------|-----------|----------|
| `gemini-2.5-flash-lite` | $0.10 | $0.40 | 1000 | High volume, simple tasks |
| `gemini-2.5-flash` | $0.15 | $0.60 | 20 | Balanced speed/quality |
| `gemini-2.5-pro` | $1.25 | $10.00 | 25 | Complex reasoning |

**Recommendation:** Use `gemini-2.5-flash-lite` for most use cases.

## API Reference

### Services

- `geminiClientCoreService` - Client initialization and configuration
- `geminiTextService` - Text generation (alias: `geminiTextGenerationService`)
- `geminiStructuredTextService` - JSON structured output
- `geminiRetryService` - Retry logic with exponential backoff

### Utilities

- `rateLimiter` - Request rate limiting
- `SimpleCache` - LRU cache with TTL
- `measureAsync` / `measureSync` - Performance measurement

## Error Handling

```typescript
try {
  const result = await geminiTextService.generateText('gemini-2.5-flash-lite', prompt);
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('API key')) {
      // Handle missing/invalid API key
    } else if (error.message.includes('429') || error.message.includes('quota')) {
      // Handle rate limit - wait and retry
    }
  }
}
```

## Best Practices

1. **Always initialize** the client before making requests
2. **Use rate limiting** to prevent API throttling
3. **Implement caching** for frequently used prompts
4. **Handle errors** gracefully with retry logic
5. **Use structured output** for consistent JSON responses
6. **Choose the right model** based on complexity and cost

## License

MIT

## Support

For detailed integration guide, see: [factory/templates/docs/ai/GEMINI_AI_PROVIDER.md](https://github.com/umituz/react-native-app-factory/blob/main/factory/templates/docs/ai/GEMINI_AI_PROVIDER.md)
