/** Job which determines which abstract needs to be processed based on the article ISSN */
import { Job } from 'bull';
import { fetchAbstractByDOI } from '../requests/doaj.service';
import {
  mongoArticleFindOneWhere,
  mongoFindJournalById,
  mongoUpdateArticleAbstractById
} from '../requests/mongoose.service';

export const getAbstract = async (job: Job) => {
  const article = await mongoArticleFindOneWhere({ doi: job.data.doi });
  const journal = await mongoFindJournalById(article.journal._id);

  if (journal.abstract_source_doaj && !article.abstract) {
    const abstract = await fetchAbstractByDOI(job.data.doi);
    await mongoUpdateArticleAbstractById(article._id, abstract);
  }
};
