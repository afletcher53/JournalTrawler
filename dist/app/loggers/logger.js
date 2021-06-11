"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOILogger = exports.jobLogger = exports.crossRefLogger = exports.mongoDBLogger = exports.systemLogger = exports.articleLogger = void 0;
const winston_1 = require("winston");
exports.articleLogger = winston_1.createLogger({
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        // new transports.Console(),
        new winston_1.transports.File({ filename: 'logs/error/error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'logs/activity/activity.log', level: 'info' }),
    ],
});
exports.systemLogger = winston_1.createLogger({
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        // new transports.Console(),
        new winston_1.transports.File({ filename: 'logs/error/error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'logs/activity/activity.log', level: 'info' }),
    ],
});
exports.mongoDBLogger = winston_1.createLogger({
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        // new transports.Console(),
        new winston_1.transports.File({
            filename: 'logs/error/mongodb_error.log', level: 'error'
        }),
        new winston_1.transports.File({ filename: 'logs/activity/mongodb_activity.log', level: 'info' }),
    ],
});
exports.crossRefLogger = winston_1.createLogger({
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'logs/error/crossref_error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'logs/activity/crossref_activity.log', level: 'info' }),
    ],
});
exports.jobLogger = winston_1.createLogger({
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'logs/error/job_error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'logs/activity/job_activity.log', level: 'info' }),
    ],
});
exports.DOILogger = winston_1.createLogger({
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        new winston_1.transports.File({ filename: 'logs/error/doi_error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'logs/activity/doi.log', level: 'info' }),
    ],
});
//# sourceMappingURL=logger.js.map