import fs from 'fs';
import path from 'path';
import systemLogger from '../loggers/system.logger';
import {
  mongoFetchAllArticles, mongoFetchAllIntegrities,
  mongoFetchAllJournals
} from '../requests/mongoose.service';

/**
 * Generates backups of all the mongoose collection models
 */
const exportData = async () => {
  const ts = Date.now();
  const dateOb = new Date(ts);
  const date = dateOb.getDate();
  const month = dateOb.getMonth() + 1;
  const year = dateOb.getFullYear();
  const directory = 'data';
  fs.readdir(directory, (err, files) => {
    if (err) {
      throw err;
    }

    for (const file of files) {
      fs.unlink(path.join(directory, file), (unlinkErr) => {
        if (unlinkErr) {
          throw unlinkErr;
        }
      });
    }
  });
  Promise.all(
    // Delete all previous backups
    [mongoFetchAllArticles().then((data) => {
      const sendData = JSON.stringify(data);
      const fileName = `data/backup_Article_${year}-${month}-${date}.csv`;
      fs.writeFile(fileName, sendData, function (error) {
        if (error) {
          systemLogger.error(error);
        }
        systemLogger.info(`Backup to  ${fileName} was a success`);
      });
    }),

    mongoFetchAllJournals().then((data) => {
      const sendData = JSON.stringify(data);
      const fileName = `data/backup_Journal_${year}-${month}-${date}.csv`;
      fs.writeFile(fileName, sendData, function (error) {
        if (error) {
          systemLogger.error(error);
        }
        systemLogger.info(`Backup to  ${fileName} was a success`);
      });
    }),

    mongoFetchAllIntegrities().then((data) => {
      const sendData = JSON.stringify(data);
      const fileName = `data/backup_Integrities_${year}-${month}-${date}.csv`;
      fs.writeFile(fileName, sendData, function (error) {
        if (error) {
          systemLogger.error(error);
        }
        systemLogger.info(`Backup to  ${fileName} was a success`);
      });
    })]
  );
};

export default exportData;
