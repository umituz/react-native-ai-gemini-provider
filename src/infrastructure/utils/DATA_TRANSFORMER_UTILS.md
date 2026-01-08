# Data Transformer Utilities

Helper functions for transforming and processing Gemini API data. Extracts and converts data formats.

## 📍 Import Path

```
import {
  extractBase64Data,
  extractTextFromResponse
} from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use data transformers to extract and convert Gemini API data formats. Handles base64 extraction and text parsing.

**When to use:**
- Extract base64 from data URLs
- Parse text from API responses
- Clean up data formats
- Transform response structures
- Process multimodal data

## 📌 Strategy

Data transformation ensures compatibility. This system:
- Extracts base64 from various formats
- Parses text from complex responses
- Handles missing data gracefully
- Normalizes data structures
- Simplifies data processing

**Key Decision**: Always use transformers for data extraction. Handles edge cases and format variations automatically.

## ⚠️ Rules

### Extraction Rules
- **MUST** handle missing data gracefully
- **SHOULD** validate input format
- **MUST** return empty string on failure
- **SHOULD** log extraction errors
- **MUST NOT** throw on invalid data

### Format Rules
- **MUST** support multiple input formats
- **SHOULD** detect format automatically
- **MUST** preserve data integrity
- **SHOULD** handle encoding correctly
- **MUST NOT** corrupt data

### Validation Rules
- **SHOULD** validate base64 before use
- **MUST** check for empty responses
- **SHOULD** handle malformed data
- **MUST** provide safe defaults
- **SHOULD NOT** assume format

### Error Handling Rules
- **MUST** wrap extraction in try-catch
- **SHOULD** log transformation errors
- **MUST** return safe defaults
- **SHOULD NOT** propagate errors
- **MUST** handle all edge cases

## 🤖 AI Agent Guidelines

### When Extracting Base64
1. **CALL** extractBase64Data()
2. **PROVIDE** data URL or base64
3. **GET** pure base64 string
4. **VALIDATE** output
5. **HANDLE** extraction errors

### When Extracting Text
1. **CALL** extractTextFromResponse()
2. **PROVIDE** Gemini response object
3. **GET** concatenated text
4. **CHECK** for empty results
5. **HANDLE** missing text

### When Transforming Data
1. **VALIDATE** input format
2. **CALL** appropriate transformer
3. **CHECK** output validity
4. **USE** transformed data
5. **HANDLE** transformation errors

### Code Style Rules
- **VALIDATE** input before transformation
- **HANDLE** all edge cases
- **PROVIDE** safe defaults
- **LOG** transformation errors
- **TEST** with various formats

## 📦 Available Functions

**Refer to**: [`gemini-data-transformer.util.ts`](./gemini-data-transformer.util.ts)

### Base64 Extraction
- `extractBase64Data(base64)` - Extract base64 from data URL

### Text Extraction
- `extractTextFromResponse(response)` - Extract text from Gemini response

## 🔗 Related Modules

- **Domain Entities**: [`../../domain/entities/README.md`](../../domain/entities/README.md)
- **Image Edit Service**: [`../services/IMAGE_EDIT_SERVICE.md`](../services/IMAGE_EDIT_SERVICE.md)
- **Response Formatter**: [`../response/RESPONSE_FORMATTER.md`](../response/RESPONSE_FORMATTER.md)

## 📋 Supported Formats

### Base64 Input Formats
- Data URL: `data:image/png;base64,iVBORw0KG...`
- Pure base64: `iVBORw0KG...`
- Various MIME types: PNG, JPEG, GIF, WebP

### Response Structure
```typescript
{
  candidates: [{
    content: {
      parts: [
        { text: string },
        { inlineData: { mimeType: string; data: string } }
      ]
    }
  }]
}
```

## 🎓 Usage Patterns

### Base64 Extraction
1. Provide data URL or base64
2. Call extractBase64Data()
3. Get pure base64 string
4. Use in API requests
5. Handle empty results

### Text Extraction
1. Provide Gemini response object
2. Call extractTextFromResponse()
3. Get concatenated text
4. Use extracted text
5. Handle empty responses

### Data Processing
1. Validate input format
2. Transform with utilities
3. Validate output
4. Use in application
5. Handle errors gracefully

## 🚨 Common Pitfalls

### Don't
- Assume data format
- Skip validation
- Throw on invalid data
- Ignore empty responses
- Corrupt data during transformation

### Do
- Validate input format
- Handle all edge cases
- Provide safe defaults
- Test with various formats
- Handle errors gracefully

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
