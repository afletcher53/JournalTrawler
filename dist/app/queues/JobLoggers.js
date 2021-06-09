"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logJobCompleted = exports.logJobFailed = void 0;
const logger_1 = require("../../logger");
function logJobFailed(type, job, error) {
    switch (type) {
        case 'journal':
            logger_1.jobLogger.error(`Journal Job failed with ID: ${job}] [${error}]`);
            break;
        case 'article':
            logger_1.jobLogger.error(`Article Job failed with ID: ${job}]  [${error}]`);
            break;
        case 'integrity':
            logger_1.jobLogger.error(`Integrity Job failed with ID: ${job}]  [${error}]`);
            break;
    }
    console.log("Failed: Job-" + job);
}
exports.logJobFailed = logJobFailed;
function logJobCompleted(type, job) {
    switch (type) {
        case 'journal':
            logger_1.jobLogger.info(`Journal Job completed with ID: ${job}]`);
            break;
        case 'article':
            logger_1.jobLogger.info(`Article Job completed with ID: ${job}]`);
            break;
        case 'integrity':
            logger_1.jobLogger.error(`Integrity Job completed with ID: ${job}]`);
            break;
    }
}
exports.logJobCompleted = logJobCompleted;
