import fs from "fs";
import path from 'path';
import systemLogger from "../loggers/system.logger";
import { mongoFetchAllArticles, mongoFetchAllIntegrities, mongoFetchAllJournals } from "../requests/mongoose.service";

/**
 * Generates backups of all the mongoose collection models
 */
const exportData = async () => {
let ts = Date.now();   
let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
const directory = 'data';
fs.readdir(directory, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
Promise.all(
// Delete all previous backups
[mongoFetchAllArticles().then((data)=> {
        const sendData = JSON.stringify(data)
        const fileName = `data/backup_Article_${year}-${month}-${date}.csv`
        fs.writeFile(fileName, sendData, function(error) {
            if (error) systemLogger.error(error);;
            systemLogger.info(`Backup to  ${fileName} was a success`);
          });
    }),

mongoFetchAllJournals().then((data)=> {
    const sendData = JSON.stringify(data)
    const fileName = `data/backup_Journal_${year}-${month}-${date}.csv`
    fs.writeFile(fileName, sendData, function(error) {
        if (error) systemLogger.error(error);;
        systemLogger.info(`Backup to  ${fileName} was a success`);
      });
}),

mongoFetchAllIntegrities().then((data)=> {
    const sendData = JSON.stringify(data)
    const fileName = `data/backup_Integrities_${year}-${month}-${date}.csv`
    fs.writeFile(fileName, sendData, function(error) {
        if (error) systemLogger.error(error);;
        systemLogger.info(`Backup to  ${fileName} was a success`);
      });
})]
)

}

export default exportData
