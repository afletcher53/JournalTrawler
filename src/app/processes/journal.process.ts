
import { Job } from 'bull';;
import { addArticle } from '../queues/article.queue';
import { DOILogger } from '../../logger';
import { fetchDOIsFromISSN, fetchJournalMetadataByISSN } from '../requests/crossref.service';

/**
 * Starts a Journal Process Job using Bull
 * @param job Incoming Job data
 */
const journalProcess = async (job: Job) => {
  generateJobsFromISSN(job.data.issn)
};

export default journalProcess;

/**
 * Create Article jobs for all DOIS in ISSN 
 * @param {String} issn to be searched on crossref
 */
const generateJobsFromISSN = async(issn: string) => {

  fetchDOIsFromISSN(encodeURI(issn))
  .then((data: any[]) => {
      data.forEach((element: { [x: string]: any; }) => {
        const {printISSN, electronicISSN} = getPrintAndElectronicISSN(element);
        const doi = {
          doi: element['DOI'],
          print_issn: printISSN,
          electronic_issn: electronicISSN
        };
        addArticle(doi)
        const logText = "["+element['DOI'] +"] added to articleQueue"
        DOILogger.info(logText)
      });
  })
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
