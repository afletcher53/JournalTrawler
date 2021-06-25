import Bull from "bull";
import winston from 'winston';
declare const jobLogger: winston.Logger;
export default jobLogger;
export declare function logJobFailed(type: string, job: Bull.Job<any>, error: Error): void;
export declare function logJobCompleted(type: string, job: Bull.Job<any>): void;
//# sourceMappingURL=job.logger.d.ts.map