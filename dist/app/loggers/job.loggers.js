"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logJobCompleted = exports.logJobFailed = void 0;
const logger_1 = require("./logger");
function logJobFailed(type, job, error) {
    logger_1.jobLogger.error(`${type} Job failed with ID: ${job}] [${error}]`);
    console.log("Failed: Job-" + job);
}
exports.logJobFailed = logJobFailed;
function logJobCompleted(type, job) {
    logger_1.jobLogger.info(`${type} Job completed with ID: ${job}]`);
}
exports.logJobCompleted = logJobCompleted;
//# sourceMappingURL=job.loggers.js.map