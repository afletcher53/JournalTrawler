"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobLogger = void 0;
const winston_1 = require("winston");
exports.jobLogger = winston_1.createLogger({
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'logs/error/job_error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'logs/activity/job_activity.log', level: 'info' }),
    ],
});
