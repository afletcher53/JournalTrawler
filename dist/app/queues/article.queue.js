"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleQueue = exports.addArticle = void 0;
const bull_1 = __importDefault(require("bull"));
const redis_config_1 = require("../config/redis.config");
const job_logger_1 = require("../loggers/job.logger");
const abstract_process_1 = require("../processes/abstract.process");
const article_process_1 = __importDefault(require("../processes/article.process"));
const articleQueue = new bull_1.default('articleQueue', {
    redis: {
        host: String(redis_config_1.redisHost),
        port: Number(redis_config_1.redisPort),
    },
});
exports.articleQueue = articleQueue;
const options = {
    attempts: 2,
    delay: 100,
};
const addArticle = async (data) => {
    const job = await articleQueue.add(data, options);
    await job.finished().then(() => {
        abstract_process_1.getAbstract(job);
    });
    return job;
};
exports.addArticle = addArticle;
articleQueue.on('global:completed', async (job) => {
    job_logger_1.logJobCompleted('article', job);
});
articleQueue.on('failed', (job, error) => {
    job_logger_1.logJobFailed('article', job, error);
});
articleQueue.process(article_process_1.default);
