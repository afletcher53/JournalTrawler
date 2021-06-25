"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.journalQueue = exports.addJournal = void 0;
const bull_1 = __importDefault(require("bull"));
const redis_config_1 = require("../config/redis.config");
const job_logger_1 = require("../loggers/job.logger");
const journal_process_1 = __importDefault(require("../processes/journal.process"));
const journalQueue = new bull_1.default('journalQueue', {
    redis: {
        host: String(redis_config_1.redisHost),
        port: Number(redis_config_1.redisPort)
    }
});
exports.journalQueue = journalQueue;
const options = {
    attempts: 2,
};
const addJournal = (data) => {
    journalQueue.add(data, options);
};
exports.addJournal = addJournal;
journalQueue.on('global:completed', async (job) => {
    job_logger_1.logJobCompleted('journal', job);
});
journalQueue.on('failed', (job, error) => {
    job_logger_1.logJobFailed('journal', job, error);
});
journalQueue.process(journal_process_1.default);
