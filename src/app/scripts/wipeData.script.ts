// /**
//  * Wipes the entire databases - Mongoose, Redis and Logs
//  */
import fs from 'fs';
import path from 'path';
import { articleQueue } from '../queues/article.queue';
import { journalQueue } from '../queues/journal.queue';
import { integrityQueue } from '../queues/integrity.queue';
import systemLogger from '../loggers/system.logger';

const wipeall = (db: {
  journals: any;
  integrity: any;
  articles: any;
  mongoose?: typeof import('mongoose');
  url?: string;
}) => {
  const Journal = db.journals;
  const Article = db.articles;
  const Integrity = db.integrity;

  Journal.deleteMany({}, function (err: Error) {
    systemLogger.info('Journals collection removed');
  });
  Article.deleteMany({}, function (err: Error) {
    systemLogger.info('Articles collection removed');
  });
  Integrity.deleteMany({}, function (err: Error) {
    systemLogger.info('Integrities collection removed');
  });

  //remove the logs
  let appDir = path.dirname(require.main.filename);
  appDir = appDir.substring(0, appDir.lastIndexOf('\\'));
  const logdir = appDir + '\\logs';
  const activitydir = logdir + '\\activity';
  const errordir = logdir + '\\error';
  rimraf(activitydir);
  rimraf(errordir);

  //flushREDISQUeue

  articleQueue.clean(0, 'delayed');
  articleQueue.clean(0, 'wait');
  articleQueue.clean(0, 'active');
  articleQueue.clean(0, 'completed');
  articleQueue.clean(0, 'failed');

  journalQueue.clean(0, 'delayed');
  journalQueue.clean(0, 'wait');
  journalQueue.clean(0, 'active');
  journalQueue.clean(0, 'completed');
  journalQueue.clean(0, 'failed');

  integrityQueue.clean(0, 'delayed');
  integrityQueue.clean(0, 'wait');
  integrityQueue.clean(0, 'active');
  integrityQueue.clean(0, 'completed');
  integrityQueue.clean(0, 'failed');
};

/**
 * Remove directory recursively
 * @param {string} dirPath
 * @see https://stackoverflow.com/a/42505874/3027390
 */
function rimraf(dirPath: fs.PathLike) {
  fs.rmdir(dirPath, { recursive: true }, (err) => {
    systemLogger.info(`${dirPath} logs deleted!`);
  });
}

export default wipeall;
