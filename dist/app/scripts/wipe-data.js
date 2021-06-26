"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// /**
//  * Wipes the entire databases - Mongoose, Redis and Logs
//  */
const models_1 = __importDefault(require("../models"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const article_queue_1 = require("../queues/article.queue");
const journal_queue_1 = require("../queues/journal.queue");
const integrity_queue_1 = require("../queues/integrity.queue");
const Journal = models_1.default.journals;
const Article = models_1.default.articles;
const Integrity = models_1.default.integrity;
const wipeall = () => {
    Journal.deleteMany({}, function (err) {
        console.log('Journals collection removed');
    });
    Article.deleteMany({}, function (err) {
        console.log('Articles collection removed');
    });
    Integrity.deleteMany({}, function (err) {
        console.log('Integrities collection removed');
    });
    //remove the logs
    var appDir = path_1.default.dirname(require.main.filename);
    appDir = appDir.substring(0, appDir.lastIndexOf('\\'));
    const logdir = appDir + "\\logs";
    console.log(logdir);
    const activitydir = logdir + "\\activity";
    const errordir = logdir + "\\error";
    rimraf(activitydir);
    rimraf(errordir);
    //flushREDISQUeue
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
/**
 * Remove directory recursively
 * @param {string} dir_path
 * @see https://stackoverflow.com/a/42505874/3027390
 */
function rimraf(dir_path) {
    fs_1.default.rmdir(dir_path, { recursive: true }, (err) => {
        // if (err) {
        //     throw err;
        // }
        console.log(`${dir_path} logs deleted!`);
    });
}
exports.default = wipeall;
