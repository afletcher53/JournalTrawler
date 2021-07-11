/** Job which determines which abstract needs to be processed based on the article ISSN */
import { Job } from 'bull';
import { fetchAbstractByDOIDOAJ } from '../requests/doaj.service';
import {
  mongoArticleFindOneWhere,
  mongoFindJournalById,
  mongoUpdateArticleAbstractById
} from '../requests/mongoose.service';
import { fetchAbstractByDOISpringer } from '../requests/springer.service';

export const getAbstract = async (job: Job) => {
  const article = await mongoArticleFindOneWhere({ doi: job.data.doi });
  const journal = await mongoFindJournalById(article.journal._id);

  if (journal.abstract_source_doaj && !article.abstract) {
    const abstract = await fetchAbstractByDOIDOAJ(job.data.doi);
    await mongoUpdateArticleAbstractById(article._id, abstract);
  }

  if (journal.abstract_source_springer && !article.abstract) {
    const abstract = await fetchAbstractByDOISpringer(job.data.doi);
    await mongoUpdateArticleAbstractById(article._id, abstract);
  }
};
