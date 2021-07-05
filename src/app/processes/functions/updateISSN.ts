import { Job } from 'bull';
import doiLogger from '../../loggers/doi.logger';
import systemLogger from '../../loggers/system.logger';
import db from '../../models';
import { addArticle } from '../../queues/article.queue';
import { fetchArticleByDOI } from '../../requests/crossref.service';
import {
  mongoCheckJournalExistsByISSN,
  mongofetchJournalByISSN
} from '../../requests/mongoose.service';
import generateMissingDOIList from './generateMissingDOIList';
import getPrintAndElectronicISSN from './getPrintAndElectronicISSNFromCrossref';
const Integrity = db.integrity;

/**
 * Updates an ISSN based on the missing DOIs list generated from Integrity check
 */
const updateISSN = async (job: Job) => {
  const checkJournalExistsMongoDB = await mongoCheckJournalExistsByISSN(
    job.data.issn
  );
  if (!checkJournalExistsMongoDB) {
    systemLogger.error('This doesnt exist on the database');
    throw Error('Journal doesnt exist on the database');
  }

  const journaldata = await mongofetchJournalByISSN(job.data.issn);
  const missingDOIs = await generateMissingDOIList(job.data.issn);
  missingDOIs.forEach(async (element) => {
    const article: Object = await fetchArticleByDOI(element);
    const { printISSN, electronicISSN } = getPrintAndElectronicISSN(
      article['message']
    );

    const ArticleData = {
      journal_id: journaldata._id,
      doi: article['message'].DOI,
      print_issn: printISSN,
      electronic_issn: electronicISSN
    };
    await addArticle(ArticleData);
    const logText = `[${element['DOI']} added to articleQueue`;
    doiLogger.info(logText);
  });
  const integrity = new Integrity({
    code: 4,
    message: `Jounal with ISSN ${job.data.issn} has been updated with ${missingDOIs.length} new additions`,
    data: missingDOIs ? missingDOIs : null
  });
  integrity.save(integrity);
};
export default updateISSN;
