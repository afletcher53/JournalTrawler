
import { Job } from 'bull';
import doiLogger from '../loggers/doi.logger';
import db from '../models';
import { fetchArticleByDOI } from '../requests/crossref.service';
import { articleCrossRefResponseValidation } from '../validation/crossref.validation';
import setArticleDetails from './functions/setArticleDetails';
import getArticleByDOI from './functions/getArticleByDOI';
import { mongoCheckJournalExistsByISSN } from '../requests/mongoose.service';

export const Article = db.articles;

/**
 * Add Article Job to the redis queue
 * @param job from the queue calling it.
 */
const articleProcess = async (job: Job) => {
  const articleExists = await getArticleByDOI(job.data.doi);
  const articleData: any = await fetchArticleByDOI(job.data.doi);

  //Validate the data.
  const { error } = articleCrossRefResponseValidation(articleData);
  if (error) {
    throw Error(error.details[0].message);
  }

  // Check journal exists in database to prevent orphaned articles
  const journalExistsElectronic = await mongoCheckJournalExistsByISSN(job.data.electronic_issn);
  const journalExistsPrint = await mongoCheckJournalExistsByISSN(job.data.print_issn);

  if (journalExistsPrint && journalExistsElectronic) {
    throw Error('The journal doesnt exist, dont add it');
  }

  if (!articleExists) {
    //Generate the article Object.
    const article = setArticleDetails(job.data.doi, job.data.print_issn, job.data.electronic_issn, articleData, job.data.journal_id);

    try {
      article
        .save(article)
        .catch((err: Error) => {
          const logText = `[${job.data.doi}] Error processing ${err}`;
          doiLogger.error(logText);
        });
    } catch (e) {
      throw Error(' The article already exists');
    }
  }



};

export default articleProcess;

