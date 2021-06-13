// /**
//  * Wipes the entire databases - Mongoose, Redis and Logs
//  */
import db from '../models';
import fs from 'fs'

import path from 'path';
import {articleQueue} from '../queues/article.queue'
import {journalQueue} from '../queues/journal.queue'
import {integrityQueue} from '../queues/integrity.queue'


const Journal = db.journals;
const Article = db.articles;
const Integrity = db.integrity;


const wipeall= ( ) =>{
    Journal.deleteMany({}, function(err: Error) { 
        console.log('Journals collection removed') 
     });
     Article.deleteMany({}, function(err: Error) { 
        console.log('Articles collection removed') 
     });
     Integrity.deleteMany({}, function(err: Error) { 
        console.log('Integrities collection removed') 
     });

     //remove the logs
     var appDir = path.dirname(require.main.filename);
     appDir = appDir.substring(0, appDir.lastIndexOf('\\'));
     const logdir = appDir + "\\logs"
     console.log(logdir)
     const activitydir = logdir + "\\activity"
     const errordir = logdir + "\\error"
     rimraf(activitydir)
     rimraf(errordir)

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


} 


/**
 * Remove directory recursively
 * @param {string} dir_path
 * @see https://stackoverflow.com/a/42505874/3027390
 */
 function rimraf(dir_path) {
    fs.rmdir(dir_path, { recursive: true }, (err) => {
        // if (err) {
        //     throw err;
        // }
    
        console.log(`${dir_path} logs deleted!`);
    });
}

export default wipeall