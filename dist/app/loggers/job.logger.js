"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logJobCompleted = exports.logJobFailed = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_vendors_1 = require("../vendors/winston.vendors");
const transports = [
    new winston_1.default.transports.Console(),
    new winston_1.default.transports.File({ filename: 'logs/error/all.log', level: 'error', }),
    new winston_1.default.transports.File({ filename: 'logs/error/job.log', level: 'error', }),
    new winston_1.default.transports.File({ filename: 'logs/activity/all.log', level: 'info' }),
    new winston_1.default.transports.File({ filename: 'logs/activity/job.log', level: 'info' }),
];
const jobLogger = winston_1.default.createLogger({
    level: winston_vendors_1.level(),
    levels: winston_vendors_1.levels,
    format: winston_vendors_1.format,
    transports,
});
exports.default = jobLogger;
function logJobFailed(type, job, error) {
    jobLogger.error(`${type} Job failed with id [${job}] [${error}]`);
}
exports.logJobFailed = logJobFailed;
function logJobCompleted(type, job) {
    jobLogger.info(`${type} Job completed with id [${job}]`);
}
exports.logJobCompleted = logJobCompleted;
