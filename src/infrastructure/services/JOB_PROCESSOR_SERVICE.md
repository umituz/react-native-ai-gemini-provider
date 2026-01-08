# Job Processor Service

Service for handling asynchronous AI generation jobs. Manages job submission, status tracking, and result retrieval with automatic async processing.

## 📍 Import Path

```
import { jobProcessor } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use job processor to handle long-running AI operations asynchronously. Submit jobs, track status, and retrieve results when ready.

**When to use:**
- Process long-running operations
- Track job status over time
- Implement async job management
- Handle video generation
- Manage background processing

## 📌 Strategy

Async processing improves UX. This service:
- Manages job lifecycle
- Tracks status changes
- Stores results for retrieval
- Handles polling automatically
- Provides job management

**Key Decision**: Use job processor for operations taking > 30 seconds. Poll for status instead of blocking.

## ⚠️ Rules

### Job Submission Rules
- **MUST** save request ID after submission
- **SHOULD** validate input before submission
- **MUST** handle submission errors
- **SHOULD** track submitted jobs
- **MUST NOT** lose request IDs

### Status Tracking Rules
- **MUST** poll status periodically
- **SHOULD** implement exponential backoff
- **MUST** handle status changes
- **SHOULD** monitor job progress
- **MUST NOT** poll too frequently

### Result Retrieval Rules
- **SHOULD** verify job completion
- **MUST** handle retrieval errors
- **SHOULD** validate result format
- **MUST** clear old results
- **SHOULD NOT** retrieve incomplete jobs

### Cleanup Rules
- **SHOULD** clear completed jobs
- **MUST** handle cleanup errors
- **SHOULD** implement job expiration
- **MUST** manage memory usage
- **SHOULD NOT** accumulate old jobs

## 🤖 AI Agent Guidelines

### When Submitting Jobs
1. **VALIDATE** input parameters
2. **CALL** submitJob()
3. **SAVE** request ID
4. **TRACK** job status
5. **HANDLE** submission errors

### When Tracking Status
1. **POLL** getJobStatus() periodically
2. **IMPLEMENT** exponential backoff
3. **CHECK** status changes
4. **UPDATE** UI accordingly
5. **HANDLE** completion

### When Retrieving Results
1. **VERIFY** job completion
2. **CALL** getJobResult()
3. **VALIDATE** result format
4. **USE** result data
5. **CLEAR** job data

### Code Style Rules
- **SAVE** request IDs persistently
- **IMPLEMENT** polling with timeout
- **HANDLE** all status cases
- **CLEAN UP** old jobs
- **LOG** job lifecycle events

## 📦 Available Service

### jobProcessor

**Refer to**: [`job-processor.ts`](./job-processor.ts)

**Methods:**
- `submitJob(model, input)` - Submit async job
- `getJobStatus(model, requestId)` - Get job status
- `getJobResult(model, requestId)` - Get job result
- `clear()` - Clear all jobs

## 🔗 Related Modules

- **Job Manager**: [`../../job/README.md`](../../job/README.md)
- **Video Generation**: [`VIDEO_GENERATION_SERVICE.md`](./VIDEO_GENERATION_SERVICE.md)
- **Generation Executor**: [`GENERATION_EXECUTOR_SERVICE.md`](./GENERATION_EXECUTOR_SERVICE.md)

## 📋 Job States

### IN_QUEUE
Job is queued, waiting to start.

### PROCESSING
Job is currently being processed.

### COMPLETED
Job finished successfully with result.

### FAILED
Job failed with error.

## 🎓 Usage Patterns

### Job Submission
1. Validate input parameters
2. Call submitJob()
3. Save request ID
4. Display submission status
5. Begin polling

### Status Polling
1. Poll getJobStatus() periodically
2. Implement exponential backoff
3. Update UI with status
4. Handle completion/failure
5. Stop polling when done

### Result Retrieval
1. Verify job completion
2. Call getJobResult()
3. Validate result format
4. Use result data
5. Clear job data

### Job Cleanup
1. Track job completion time
2. Clear old completed jobs
3. Remove failed jobs
4. Manage memory usage
5. Implement expiration

## 🚨 Common Pitfalls

### Don't
- Lose request IDs
- Poll too frequently
- Skip error handling
- Forget to clean up jobs
- Block on job submission

### Do
- Save request IDs persistently
- Implement exponential backoff
- Handle all job states
- Clean up completed jobs
- Provide user feedback

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
