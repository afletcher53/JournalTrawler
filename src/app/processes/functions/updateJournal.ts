import { Job } from "bull";
import { DOILogger } from "../../loggers/logger";
import { addArticle } from "../../queues/article.queue";
import { fetchArticleByDOI } from "../../requests/crossref.service";
import { mongoCheckJournalExistsByISSN, mongofetchJournalByISSN } from "../../requests/mongoose.service";
import { generateMissingDOIList } from "./generateMissingDOIList";
import { getPrintAndElectronicISSN } from "./getPrintAndElectronicISSNFromCrossref";



/**
 * Updates a journal based on missing DOIs list generated from Integrity check
 * First check to see if the Journal exists in the database then generate missing list of DOIS, then add them
 */
 const updateISSN = async (job: Job<any>) => {
    const checkJournalExistsMongoDB = await mongoCheckJournalExistsByISSN(job.data.issn);
    if (!checkJournalExistsMongoDB) {
      console.log('This doesnt exist on the database')
      throw Error('Journal doesnt exist on the database')
    };

    const journaldata = await mongofetchJournalByISSN(job.data.issn)
    // collect list of DOIs for the issn
    const missingDOIs = await generateMissingDOIList(job.data.issn)
    //Add article jobs with the missing DOI information
    missingDOIs.forEach(async element => {
        const article: Object = await fetchArticleByDOI(element)
        console.log(article['message'].DOI)
        const {printISSN, electronicISSN} = getPrintAndElectronicISSN(article['message']);

            const ArticleData = {
             journal_id: journaldata._id,
             doi: article['message'].DOI,
             print_issn: printISSN,
             electronic_issn: electronicISSN,
    };
    console.log(ArticleData)
    

    await addArticle(ArticleData)
    const logText = "["+element['DOI'] +"] added to articleQueue"
    DOILogger.info(logText)

    });
    // const {printISSN, electronicISSN} = getPrintAndElectronicISSN(e);
    // const ArticleData = {
    //   doi: e['DOI'],
    //   print_issn: printISSN,
    //   electronic_issn: electronicISSN,
    //   journal_id: journalId
    // };

     //TODO save that the integrity has been ran to the DB
     
 }
export default updateISSN