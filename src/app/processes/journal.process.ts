
import { Job } from 'bull';
import { DOILogger } from '../loggers/logger';
import { addArticle } from '../queues/article.queue';
import { fetchDOIsFromISSN } from '../requests/crossref.service';


/**
 * Starts a Journal Process Job using Bull
 * @param job Incoming Job data
 */
const journalProcess = async (job: Job) => {
  generateJobsFromISSN(job.data.issn, job.data.journal_id)
};

export default journalProcess;

/**
 * Create Article jobs for all DOIS in ISSN 
 * @param {String} issn to be searched on crossref
 */
const generateJobsFromISSN = async(issn: string, journalId: string) => {
  const DOIlist = await fetchDOIsFromISSN(encodeURI(issn))
  await processArticles(DOIlist, journalId)
}

const processArticles = async(DOIList: any, journalId: string) => {
  let articleList = []

  await Promise.all(DOIList.map(async (e: Object) => {
    const {printISSN, electronicISSN} = getPrintAndElectronicISSN(e);
    const ArticleData = {
      doi: e['DOI'],
      print_issn: printISSN,
      electronic_issn: electronicISSN,
      journal_id: journalId
    };
    const articleJob = await addArticle(ArticleData)
    articleList.push(articleJob)
    const logText = "["+e['DOI'] +"] added to articleQueue"
    DOILogger.info(logText)
    return articleList
  }))

  return articleList
}

/**
 * Return print / electronic ISSN.
 * @param issnObject Object given by CrossRef API
 * @returns issn of Print/Electronic, null if not available - String
 */
const getPrintAndElectronicISSN = (issnObject: Object)  => {
  let printISSN: string, electronicISSN: string
  issnObject['issn-type'].forEach((element: { type: string; value: any; }) => {
    if(printISSN == undefined) printISSN =  element.type =='print' ? printISSN = String(element.value) : null
    if(electronicISSN == undefined) electronicISSN =  element.type =='electronic' ? electronicISSN = String(element.value) : null
  });
  return { 
    printISSN,
    electronicISSN
  }
}
