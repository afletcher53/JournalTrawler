"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addArticle = void 0;
const bull_1 = __importDefault(require("bull"));
console.log(process.env.REDIS_URL);
const articleQueue = new bull_1.default('articleQueue', {
    redis: {
        host: '127.0.0.1',
        port: 6379,
        password: 'root'
    }
});
const data = {
    email: 'userid@domain.com'
};
const options = {
    delay: 60000,
    attempts: 2
};
// articleQueue.process(articleProcess);
const addArticle = (data) => {
    articleQueue.add(data, options);
};
exports.addArticle = addArticle;
