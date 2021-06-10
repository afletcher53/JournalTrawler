"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleQueue = exports.addArticle = void 0;
const bull_1 = __importDefault(require("bull"));
const article_process_1 = __importDefault(require("../processes/article.process"));
const redis = __importStar(require("../config/redis.config"));
const job_loggers_1 = require("../loggers/job.loggers");
const articleQueue = new bull_1.default('articleQueue', {
    redis: {
        host: String(redis.config.host),
        port: Number(redis.config.port)
    }
});
exports.articleQueue = articleQueue;
const options = {
    attempts: 2,
    delay: 100,
};
const addArticle = async (data) => {
    const job = await articleQueue.add(data, options);
    return job;
};
exports.addArticle = addArticle;
articleQueue.on('global:completed', async (job) => {
    job_loggers_1.logJobCompleted('article', job);
});
articleQueue.on('failed', (job, error) => {
    job_loggers_1.logJobFailed('article', job, error);
});
articleQueue.process(article_process_1.default);
