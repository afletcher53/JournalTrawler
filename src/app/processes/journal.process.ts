
import { Job } from 'bull';
import doiLogger from '../loggers/doi.logger';
import { addArticle } from '../queues/article.queue';
import { fetchDOIsFromISSN } from '../requests/crossref.service';
import getPrintAndElectronicISSN from './functions/getPrintAndElectronicISSNFromCrossref';


/**
 * Starts a Journal Process Job using Bull
 * @param job Incoming Job data
 */
const journalProcess = async (job: Job) => {
  generateJobsFromISSN(job.data.issn, job.data.journal_id);
};

export default journalProcess;

/**
 * Create Article jobs for all DOIS in ISSN
 * @param {String} issn to be searched on crossref
 */
const generateJobsFromISSN = async (issn: string, journalId: string) => {
  const DOIlist = await fetchDOIsFromISSN(encodeURI(issn));
  await processArticles(DOIlist, journalId);
};

const processArticles = async (DOIList: any, journalId: string) => {
  const articleList = [];

  await Promise.all(DOIList.map(async (e: Object) => {
    const { printISSN, electronicISSN } = getPrintAndElectronicISSN(e);
    const ArticleData = {
      doi: e['DOI'],
      print_issn: printISSN,
      electronic_issn: electronicISSN,
      journal_id: journalId,
    };
    const articleJob = await addArticle(ArticleData);
    articleList.push(articleJob);
    const logText = `[${e['DOI']}] added to articleQueue`;
    doiLogger.info(logText);
    return articleList;
  }));

  return articleList;
};


