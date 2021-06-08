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
exports.addJournal = void 0;
const bull_1 = __importDefault(require("bull"));
const journal_process_1 = __importDefault(require("../processes/journal.process"));
const redis = __importStar(require("../config/redis.config"));
const journalQueue = new bull_1.default('journalQueue', {
    redis: {
        host: String(redis.config.host),
        port: Number(redis.config.port)
    }
});
const options = {
    attempts: 2,
};
const addJournal = (data) => {
    journalQueue.add(data, options);
};
exports.addJournal = addJournal;
journalQueue.process(journal_process_1.default);
