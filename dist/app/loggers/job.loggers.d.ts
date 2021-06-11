import Bull from "bull";
export declare function logJobFailed(type: string, job: Bull.Job<any>, error: Error): void;
export declare function logJobCompleted(type: string, job: Bull.Job<any>): void;
//# sourceMappingURL=job.loggers.d.ts.map