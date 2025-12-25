/**
 * Job Processor
 * Handles async job processing
 */

import { JobManager } from "../job/JobManager";
import type { JobSubmission, JobStatus } from "../job/JobManager";
import { generationExecutor } from "./generation-executor";

declare const __DEV__: boolean;

export class JobProcessor {
    private jobManager = new JobManager();

    submitJob(model: string, input: Record<string, unknown>): Promise<JobSubmission> {
        const submission = this.jobManager.submitJob(model, input);

        this.processJobAsync(submission.requestId).catch((error) => {
            if (typeof __DEV__ !== "undefined" && __DEV__) {
                // eslint-disable-next-line no-console
                console.error("[GeminiProvider] Job failed:", error);
            }
        });

        return Promise.resolve(submission);
    }

    getJobStatus(_model: string, requestId: string): Promise<JobStatus> {
        const status = this.jobManager.getJobStatus(requestId);
        return Promise.resolve(status);
    }

    getJobResult<T = unknown>(_model: string, requestId: string): Promise<T> {
        try {
            const result = this.jobManager.getJobResult<T>(requestId);
            return Promise.resolve(result);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    clear(): void {
        this.jobManager.clear();
    }

    private async processJobAsync(requestId: string): Promise<void> {
        const job = this.jobManager.getJob(requestId);
        if (!job) return;

        this.jobManager.updateJobStatus(requestId, "IN_PROGRESS");

        try {
            const result = await generationExecutor.executeGeneration(job.model, job.input);
            this.jobManager.setJobResult(requestId, result);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.jobManager.setJobError(requestId, errorMessage);
        }
    }
}

export const jobProcessor = new JobProcessor();
