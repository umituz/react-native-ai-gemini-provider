/**
 * Job Manager
 * Handles async job submission, tracking, and status management
 */


export type AIJobStatusType = "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export interface JobSubmission {
  requestId: string;
  statusUrl?: string;
  responseUrl?: string;
}

export interface JobStatus {
  status: AIJobStatusType;
}

interface PendingJob {
  model: string;
  input: Record<string, unknown>;
  status: AIJobStatusType;
  result?: unknown;
  error?: string;
}

export class JobManager {
  private pendingJobs: Map<string, PendingJob> = new Map();
  private jobCounter = 0;

  submitJob(model: string, input: Record<string, unknown>): JobSubmission {
    const requestId = this.generateRequestId();

    this.pendingJobs.set(requestId, {
      model,
      input,
      status: "IN_QUEUE",
    });


    return {
      requestId,
      statusUrl: undefined,
      responseUrl: undefined,
    };
  }

  getJobStatus(requestId: string): JobStatus {
    const job = this.pendingJobs.get(requestId);

    if (!job) {
      return { status: "FAILED" };
    }

    return { status: job.status };
  }

  getJobResult<T = unknown>(requestId: string): T {
    const job = this.pendingJobs.get(requestId);

    if (!job) {
      throw new Error(`Job ${requestId} not found`);
    }

    if (job.status !== "COMPLETED") {
      throw new Error(`Job ${requestId} not completed`);
    }

    if (job.error) {
      throw new Error(job.error);
    }

    this.pendingJobs.delete(requestId);

    return job.result as T;
  }

  updateJobStatus(requestId: string, status: AIJobStatusType): void {
    const job = this.pendingJobs.get(requestId);
    if (job) {
      job.status = status;
    }
  }

  setJobResult(requestId: string, result: unknown): void {
    const job = this.pendingJobs.get(requestId);
    if (job) {
      job.result = result;
      job.status = "COMPLETED";
    }
  }

  setJobError(requestId: string, error: string): void {
    const job = this.pendingJobs.get(requestId);
    if (job) {
      job.error = error;
      job.status = "FAILED";
    }
  }

  getJob(requestId: string): PendingJob | undefined {
    return this.pendingJobs.get(requestId);
  }

  clear(): void {
    this.pendingJobs.clear();
    this.jobCounter = 0;
  }

  private generateRequestId(): string {
    this.jobCounter++;
    return `gemini-${Date.now()}-${this.jobCounter}`;
  }
}
