"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const system_logger_1 = __importDefault(require("../app/loggers/system.logger"));
const getActualRequestDurationInMilliseconds_1 = __importDefault(require("./functions/getActualRequestDurationInMilliseconds"));
/**
 * Middleware to log requests to the systemLogger
 * @param req Express request
 * @param res Express response
 * @param next Express NextFunction
 */
const logRequests = (req, res, next) => {
    const { method } = req;
    const url = req.url;
    const status = res.statusCode;
    const start = process.hrtime();
    const durationInMilliseconds = getActualRequestDurationInMilliseconds_1.default(start);
    const textlog = `[${method}:${url} ${status}] ${durationInMilliseconds.toLocaleString() + 'ms'}`;
    system_logger_1.default.info(textlog);
    next();
};
exports.default = logRequests;
