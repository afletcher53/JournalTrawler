"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const article_queue_1 = require("../queues/article.queue");
const journal_queue_1 = require("../queues/journal.queue");
const integrity_queue_1 = require("../queues/integrity.queue");
const system_logger_1 = __importDefault(require("../loggers/system.logger"));
const wipeall = (db) => {
    const Journal = db.journals;
    const Article = db.articles;
    const Integrity = db.integrity;
    Journal.deleteMany({}, function (err) {
        system_logger_1.default.info('Journals collection removed');
    });
    Article.deleteMany({}, function (err) {
        system_logger_1.default.info('Articles collection removed');
    });
    Integrity.deleteMany({}, function (err) {
        system_logger_1.default.info('Integrities collection removed');
    });
    let appDir = path_1.default.dirname(require.main.filename);
    appDir = appDir.substring(0, appDir.lastIndexOf('\\'));
    const logdir = appDir + '\\logs';
    const activitydir = logdir + '\\activity';
    const errordir = logdir + '\\error';
    rimraf(activitydir);
    rimraf(errordir);
    article_queue_1.articleQueue.clean(0, 'delayed');
    article_queue_1.articleQueue.clean(0, 'wait');
    article_queue_1.articleQueue.clean(0, 'active');
    article_queue_1.articleQueue.clean(0, 'completed');
    article_queue_1.articleQueue.clean(0, 'failed');
    journal_queue_1.journalQueue.clean(0, 'delayed');
    journal_queue_1.journalQueue.clean(0, 'wait');
    journal_queue_1.journalQueue.clean(0, 'active');
    journal_queue_1.journalQueue.clean(0, 'completed');
    journal_queue_1.journalQueue.clean(0, 'failed');
    integrity_queue_1.integrityQueue.clean(0, 'delayed');
    integrity_queue_1.integrityQueue.clean(0, 'wait');
    integrity_queue_1.integrityQueue.clean(0, 'active');
    integrity_queue_1.integrityQueue.clean(0, 'completed');
    integrity_queue_1.integrityQueue.clean(0, 'failed');
};
function rimraf(dirPath) {
    fs_1.default.rmdir(dirPath, { recursive: true }, (err) => {
        system_logger_1.default.info(`${dirPath} logs deleted!`);
    });
}
exports.default = wipeall;
