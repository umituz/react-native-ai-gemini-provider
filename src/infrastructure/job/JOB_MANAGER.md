# Job Manager

Handles async job submission, tracking, and status management for AI generation tasks.

## 📍 Import Path

```
import { JobManager } from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use job manager to handle long-running AI operations asynchronously. Manages job lifecycle, status tracking, and result retrieval.

**When to use:**
- Submit long-running AI operations
- Track job status over time
- Implement polling for completion
- Manage async job lifecycles
- Retrieve results when ready

## 📌 Strategy

Job manager abstracts async operation complexity. This system:
- Generates unique job IDs
- Tracks job status through lifecycle
- Stores results for retrieval
- Handles errors gracefully
- Supports status polling

**Key Decision**: Use job manager for video generation and other long-running operations. Poll for status instead of blocking.

## ⚠️ Rules

### Usage Rules
- **MUST** save job ID after submission
- **SHOULD** check job status before getting result
- **MUST** handle job completion and failure
- **SHOULD** implement polling for long operations
- **MUST NOT** lose job IDs

### Job Lifecycle Rules
- **JOBS** start as IN_QUEUE
- **MUST** update status through lifecycle
- **SHOULD** set result or error on completion
- **MUST** handle all status transitions
- **SHOULD** clean up completed jobs

### Error Handling Rules
- **MUST** set job error on failure
- **SHOULD** propagate errors to callers
- **MUST** handle timeout scenarios
- **SHOULD** log job failures
- **MUST NOT** leave jobs in invalid state

### Polling Rules
- **SHOULD** poll with appropriate intervals
- **MUST** implement timeout for polling
- **SHOULD** handle polling errors
- **MUST** stop polling on completion
- **SHOULD NOT** poll too frequently

## 🤖 AI Agent Guidelines

### When Submitting Jobs
1. **CALL** submitJob() with model and input
2. **SAVE** returned job ID
3. **TRACK** job status
4. **HANDLE** completion/error
5. **RETRIEVE** result when ready

### When Polling Jobs
1. **IMPLEMENT** polling loop with timeout
2. **CHECK** job status each iteration
3. **WAIT** between polls (exponential backoff)
4. **RETURN** result on completion
5. **THROW** on timeout or failure

### When Managing Job Lifecycle
1. **UPDATE** status appropriately
2. **SET** result on success
3. **SET** error on failure
4. **VERIFY** state transitions
5. **CLEAN UP** old jobs

### Code Style Rules
- **USE** descriptive job inputs
- **HANDLE** all job status cases
- **IMPLEMENT** polling with timeout
- **LOG** job state changes
- **VALIDATE** job IDs

## 📦 Available Class

### JobManager

**Refer to**: [`JobManager.ts`](./JobManager.ts)

**Methods:**
- `submitJob(model, input)` - Submit new job
- `getJobStatus(requestId)` - Get job status
- `getJobResult(requestId)` - Get job result
- `updateJobStatus(requestId, status)` - Update job status
- `setJobResult(requestId, result)` - Set job result
- `setJobError(requestId, error)` - Set job error
- `getJob(requestId)` - Get job details
- `clear()` - Clear all jobs

## 🔗 Related Modules

- **Video Generation Service**: [`../services/VIDEO_GENERATION_SERVICE.md`](../services/VIDEO_GENERATION_SERVICE.md)
- **Job Processor**: [`../services/JOB_PROCESSOR_SERVICE.md`](../services/JOB_PROCESSOR_SERVICE.md)
- **Infrastructure README**: [`../infrastructure/README.md`](../infrastructure/README.md)

## 📋 Job Status Types

### IN_QUEUE
Job is queued, waiting to start.

### PROCESSING
Job is currently being processed.

### COMPLETED
Job finished successfully with result.

### FAILED
Job failed with error.

### CANCELLED
Job was cancelled before completion.

## 🎓 Usage Patterns

### Job Submission
1. Create JobManager instance
2. Call submitJob() with model and input
3. Store returned job ID
4. Monitor job status
5. Retrieve result when complete

### Status Polling
1. Submit job and get ID
2. Poll job status periodically
3. Check for COMPLETED or FAILED
4. Implement timeout
5. Return result or throw error

### Job Lifecycle Management
1. Submit job to manager
2. Update status to PROCESSING
3. Perform operation
4. Set result or error
5. Handle completion

## 🚨 Common Pitfalls

### Don't
- Lose job ID after submission
- Call getJobResult() without checking status
- Poll too frequently
- Forget to implement timeout
- Leave completed jobs in queue

### Do
- Always save job ID
- Check status before getting result
- Use exponential backoff for polling
- Implement timeout for polling
- Clean up completed jobs

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../../../AI_GUIDELINES.md)
