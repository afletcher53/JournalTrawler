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
exports.integrityQueue = exports.addIntegrity = void 0;
const bull_1 = __importDefault(require("bull"));
const integrity_process_1 = __importDefault(require("../processes/integrity.process"));
const redis = __importStar(require("../config/redis.config"));
const JobLoggers_1 = require("./JobLoggers");
const integrityQueue = new bull_1.default('integrityQueue', {
    redis: {
        host: String(redis.config.host),
        port: Number(redis.config.port)
    }
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
    JobLoggers_1.logJobCompleted('article', job);
});
integrityQueue.on('failed', (job, error) => {
    JobLoggers_1.logJobFailed('article', job, error);
});
integrityQueue.process(integrity_process_1.default);