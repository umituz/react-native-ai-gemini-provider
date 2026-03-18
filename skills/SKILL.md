---
name: setup-react-native-ai-gemini-provider
description: Sets up Google Gemini AI provider for React Native apps with automated installation and configuration. Triggers on: Setup Gemini AI, install Gemini provider, Google Gemini, useGemini, AI text generation, structured JSON, streaming responses, Gemini Flash, Gemini Pro.
---

# Setup React Native AI - Gemini Provider

Comprehensive setup for `@umituz/react-native-ai-gemini-provider` - Google Gemini AI integration.

## Overview

This skill handles everything needed to integrate Google Gemini AI into your React Native or Expo app:
- Package installation and updates
- API key configuration
- Provider setup
- Text generation with Gemini Flash/Pro
- Structured JSON output
- Streaming responses
- Safety filters

## Quick Start

Just say: **"Setup Gemini AI in my app"** and this skill will handle everything.

**Supported Features:**
- Text generation (Gemini Flash, Gemini Pro)
- Structured JSON generation
- Streaming responses
- Multi-turn conversations
- Safety filters
- Function calling support

## When to Use

Invoke this skill when you need to:
- Install @umituz/react-native-ai-gemini-provider
- Set up Google Gemini API
- Add AI text generation
- Generate structured JSON data
- Implement streaming responses
- Add conversational AI features

## Step 1: Analyze the Project

### Check package.json

```bash
cat package.json | grep "@umituz/react-native-ai-gemini-provider"
npm list @umituz/react-native-ai-gemini-provider
```

### Detect Project Type

```bash
cat app.json | grep -q "expo" && echo "Expo" || echo "Bare RN"
```

## Step 2: Install Package

### Install or Update

```bash
npm install @umituz/react-native-ai-gemini-provider@latest
```

### Install Dependencies

```bash
# Required dependencies
npm install @umituz/react-native-ai-generation-content
npm install @umituz/react-native-design-system

# Google AI SDK
npm install @google/generative-ai
```

## Step 3: Get Gemini API Key

### Create API Key

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

### Add to Environment Variables

Create or update `.env`:

```bash
cat > .env.example << 'EOF'
# Google Gemini AI Configuration
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
EOF

# Add to .env
echo "EXPO_PUBLIC_GEMINI_API_KEY=AIzaSy..." >> .env
```

### Verify API Key

```bash
grep EXPO_PUBLIC_GEMINI_API_KEY .env
```

## Step 4: Initialize Gemini Provider

### Set Up Provider

In your app entry point:

```typescript
import { GeminiProvider } from '@umituz/react-native-ai-gemini-provider';
import { ConfigProvider } from '@umituz/react-native-ai-generation-content';

export default function RootLayout() {
  const geminiConfig = {
    apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
    model: 'gemini-2.5-flash', // or 'gemini-2.5-pro'
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  };

  return (
    <GeminiProvider config={geminiConfig}>
      <ConfigProvider>
        <Stack>{/* your screens */}</Stack>
      </ConfigProvider>
    </GeminiProvider>
  );
}
```

### Check If Already Configured

```bash
grep -r "GeminiProvider" app/ App.tsx 2>/dev/null
```

## Step 5: Use Text Generation

### Basic Text Generation

```typescript
import { useGemini } from '@umituz/react-native-ai-gemini-provider';

export function TextGenerationScreen() {
  const { generateText, result, isLoading, error } = useGemini({
    model: 'gemini-2.5-flash',
  });

  const [prompt, setPrompt] = useState('Write a short poem about coding');

  const handleGenerate = async () => {
    try {
      const response = await generateText({
        prompt: prompt,
        temperature: 0.7,
        maxTokens: 1000,
      });

      console.log('Generated text:', response.text);
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  return (
    <View>
      <TextInput
        value={prompt}
        onChangeText={setPrompt}
        placeholder="Enter your prompt..."
      />

      {isLoading && <ActivityIndicator />}

      {result && <Text>{result.text}</Text>}

      <Button
        title="Generate"
        onPress={handleGenerate}
        disabled={isLoading}
      />
    </View>
  );
}
```

### Multi-turn Conversation

```typescript
import { useGemini } from '@umituz/react-native-ai-gemini-provider';

export function ChatScreen() {
  const { generateText, chatHistory } = useGemini({
    model: 'gemini-2.5-pro',
    enableChatHistory: true,
  });

  const [messages, setMessages] = useState([
    { role: 'user', parts: 'Hello! Can you help me?' },
  ]);

  const sendMessage = async (userMessage: string) => {
    const response = await generateText({
      prompt: userMessage,
      chatHistory: messages,
    });

    setMessages([
      ...messages,
      { role: 'user', parts: userMessage },
      { role: 'model', parts: response.text },
    ]);

    return response.text;
  };

  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => (
        <Text>{item.role}: {item.parts}</Text>
      )}
    />
  );
}
```

## Step 6: Generate Structured JSON

### JSON Generation

```typescript
import { useGemini } from '@umituz/react-native-ai-gemini-provider';

export function StructuredDataScreen() {
  const { generateJSON } = useGemini({
    model: 'gemini-2.5-pro',
  });

  const generateRecipe = async () => {
    try {
      const recipe = await generateJSON({
        prompt: 'Generate a chocolate cake recipe',
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            ingredients: {
              type: 'array',
              items: { type: 'string' },
            },
            instructions: {
              type: 'array',
              items: { type: 'string' },
            },
            cookingTime: { type: 'number' },
          },
        },
      });

      console.log('Recipe:', recipe);
      /*
      {
        name: "Chocolate Cake",
        ingredients: ["flour", "sugar", "cocoa powder", ...],
        instructions: ["Mix dry ingredients", ...],
        cookingTime: 45
      }
      */
    } catch (err) {
      console.error('JSON generation failed:', err);
    }
  };

  return (
    <Button title="Generate Recipe" onPress={generateRecipe} />
  );
}
```

## Step 7: Streaming Responses

### Streaming Text Generation

```typescript
import { useGemini } from '@umituz/react-native-ai-gemini-provider';

export function StreamingScreen() {
  const { generateTextStream } = useGemini({
    model: 'gemini-2.5-flash',
  });

  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const handleStream = async () => {
    setIsStreaming(true);
    setStreamedText('');

    try {
      await generateTextStream({
        prompt: 'Tell me a story about a robot',
        onChunk: (chunk) => {
          setStreamedText((prev) => prev + chunk);
        },
      });
    } catch (err) {
      console.error('Stream failed:', err);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <View>
      <ScrollView>
        <Text>{streamedText}</Text>
      </ScrollView>

      {isStreaming && <ActivityIndicator />}

      <Button
        title="Start Stream"
        onPress={handleStream}
        disabled={isStreaming}
      />
    </View>
  );
}
```

## Step 8: Configure Safety Filters

### Safety Settings

```typescript
import { useGemini } from '@umituz/react-native-ai-gemini-provider';

export function SafeGenerationScreen() {
  const { generateText } = useGemini({
    model: 'gemini-2.5-flash',
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  });

  // Use generateText as normal
  // Content will be filtered based on safety settings
}
```

## Step 9: Error Handling

### Handle Common Errors

```typescript
import { GeminiErrorType, useGemini } from '@umituz/react-native-ai-gemini-provider';

export function GenerationScreen() {
  const { generateText, error, isLoading } = useGemini({
    model: 'gemini-2.5-flash',
  });

  const handleGenerate = async () => {
    try {
      const result = await generateText({
        prompt: 'Generate some text',
      });
      return result;
    } catch (err) {
      if (error?.type === GeminiErrorType.INVALID_API_KEY) {
        Alert.alert('Invalid API Key', 'Check your Gemini API key');
      } else if (error?.type === GeminiErrorType.QUOTA_EXCEEDED) {
        Alert.alert('Quota Exceeded', 'You have exceeded your quota');
      } else if (error?.type === GeminiErrorType.SAFETY_FILTER) {
        Alert.alert('Content Blocked', 'Response was blocked by safety filters');
      } else {
        Alert.alert('Error', error?.message || 'Generation failed');
      }
    }
  };

  return <View>{/* UI */}</View>;
}
```

## Step 10: Verify Setup

### Run the App

```bash
npx expo start
# or
npx react-native run-ios
```

### Verification Checklist

- ✅ Package installed
- ✅ API key configured
- ✅ GeminiProvider wraps app
- ✅ Text generation works
- ✅ JSON generation works
- ✅ Streaming works
- ✅ Safety filters active

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Missing API key | Add EXPO_PUBLIC_GEMINI_API_KEY to .env |
| Invalid API key | Verify key at https://aistudio.google.com |
| Not wrapping with GeminiProvider | GeminiProvider must wrap app |
| Wrong model name | Use 'gemini-2.5-flash' or 'gemini-2.5-pro' |
| Safety filters too strict | Adjust threshold levels |
| JSON schema issues | Validate schema structure |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Invalid API key"** | Check key format and verify in Google AI Studio |
| **"Quota exceeded"** | Check your usage limits at Google AI Studio |
| **"Content blocked"** | Adjust safety filter thresholds |
| **"Stream not working"** | Ensure onChunk callback is provided |
| **"Model not found"** | Verify model name (gemini-2.5-flash or gemini-2.5-pro) |

## Available Models

| Model | Use Case | Speed |
|-------|----------|-------|
| gemini-2.5-flash | Fast responses, simple tasks | Fast |
| gemini-2.5-pro | Complex reasoning, long content | Slower |

## Pricing

Free tier limits:
- 15 requests per minute
- 1,500 requests per day

Paid tier: Pay-per-use after free limits

See https://ai.google.dev/pricing for current rates.

## Summary

After setup, provide:

1. ✅ Package version installed
2. ✅ API key configured
3. ✅ Provider location
4. ✅ Generation features working
5. ✅ Streaming configured
6. ✅ Safety filters active
7. ✅ Verification status

---

**Compatible with:** @umituz/react-native-ai-gemini-provider@latest
**Platforms:** React Native (Expo & Bare)
**API:** Google Gemini AI (https://ai.google.dev/)
**Cost:** Free tier available, then pay-per-use
