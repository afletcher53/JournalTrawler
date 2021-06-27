"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrityQueue = exports.addIntegrity = void 0;
const bull_1 = __importDefault(require("bull"));
const redis_config_1 = require("../config/redis.config");
const job_logger_1 = require("../loggers/job.logger");
const integrity_process_1 = __importDefault(require("../processes/integrity.process"));
const integrityQueue = new bull_1.default('integrityQueue', {
    redis: {
        host: String(redis_config_1.redisHost),
        port: Number(redis_config_1.redisPort),
    },
});
exports.integrityQueue = integrityQueue;
const options = {
    attempts: 2,
    delay: 100,
};
const addIntegrity = (data) => {
    integrityQueue.add(data, options);
};
exports.addIntegrity = addIntegrity;
integrityQueue.on('global:completed', async (job) => {
    job_logger_1.logJobCompleted('integrity', job);
});
integrityQueue.on('failed', (job, error) => {
    job_logger_1.logJobFailed('integrity', job, error);
});
integrityQueue.process(integrity_process_1.default);
