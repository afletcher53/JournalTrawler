"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const system_logger_1 = __importDefault(require("../app/loggers/system.logger"));
const getActualRequestDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9; // convert to nanoseconds
    const NS_TO_MS = 1e6; // convert to milliseconds
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};
/**
 * Middleware to log requests to the systemLogger
 * @param req Express request
 * @param res Express response
 * @param next Express NextFunction
 */
const logRequests = (req, res, next) => {
    const current_datetime = new Date();
    const formatted_date = current_datetime.getFullYear() +
        '-' +
        (current_datetime.getMonth() + 1) +
        '-' +
        current_datetime.getDate() +
        ' ' +
        current_datetime.getHours() +
        ':' +
        current_datetime.getMinutes() +
        ':' +
        current_datetime.getSeconds();
    const method = req.method;
    const url = req.url;
    const status = res.statusCode;
    const start = process.hrtime();
    const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
    const log = `[${chalk_1.default.blue(formatted_date)}] ${method}:${url} ${status} ${chalk_1.default.red(durationInMilliseconds.toLocaleString() + 'ms')}`;
    console.log(log);
    const textlog = `[${method}:${url} ${status}] ${durationInMilliseconds.toLocaleString() + 'ms'}`;
    system_logger_1.default.info(textlog);
    next();
};
exports.default = logRequests;
