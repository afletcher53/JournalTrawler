
import { Job } from 'bull';
import doiLogger from '../loggers/doi.logger';
import db from '../models';
import { fetchArticleByDOI } from '../requests/crossref.service';
import { articleCrossRefResponseValidation } from '../validation/crossref.validation';
import setArticleDetails from './functions/setArticleDetails';
import getArticleByDOI from './functions/getArticleByDOI';

export const Article = db.articles;

/**
 * Add Article Job to the redis queue
 * @param job from the queue calling it.
 */
const articleProcess = async (job: Job) => {
  await getArticleByDOI(job.data.doi);
  const articleData: any = await fetchArticleByDOI(job.data.doi);

  //Validate the data.
  const { error } = articleCrossRefResponseValidation(articleData);
  if (error) {
    throw Error(error.details[0].message);
  }

  //TODO: check to see that a journal exists in the mongodb (to prevent orphaned articles) TODO


  //Generate the article Object.
  const article = setArticleDetails(job.data.doi, job.data.print_issn, job.data.electronic_issn, articleData, job.data.journal_id);
  article
    .save(article)
    .catch((err: Error) => {
      const logText = `[${job.data.doi}] Error processing ${err}`;
      doiLogger.error(logText);
    });

};

export default articleProcess;


