"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.abstractQueue = exports.addJournal = void 0;
const bull_1 = __importDefault(require("bull"));
const redis_config_1 = require("../config/redis.config");
const job_logger_1 = require("../loggers/job.logger");
const abstract_process_1 = require("../processes/abstract.process");
const abstractQueue = new bull_1.default('abstractQueue', {
    redis: {
        host: String(redis_config_1.redisHost),
        port: Number(redis_config_1.redisPort)
    }
});
exports.abstractQueue = abstractQueue;
const options = {
    attempts: 2,
};
const addJournal = (data) => {
    abstractQueue.add(data, options);
};
exports.addJournal = addJournal;
abstractQueue.on('global:completed', async (job) => {
    job_logger_1.logJobCompleted('journal', job);
});
abstractQueue.on('failed', (job, error) => {
    job_logger_1.logJobFailed('journal', job, error);
});
abstractQueue.process(abstract_process_1.getAbstract);
