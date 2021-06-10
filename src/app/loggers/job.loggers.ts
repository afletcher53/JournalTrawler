import Bull from "bull";
import { jobLogger } from '../../logger';

export function logJobFailed(type: string, job: Bull.Job<any>, error: Error) {
  jobLogger.error(`${type} Job failed with ID: ${job}] [${error}]`);
  console.log("Failed: Job-" + job);
}
export function logJobCompleted(type: string, job: Bull.Job<any>) {
  jobLogger.info(`${type} Job completed with ID: ${job}]`);
}
