import { Job } from "bull";
import doiLogger from "../../loggers/doi.logger";
import db from '../../models';
import { addArticle } from "../../queues/article.queue";
import { fetchArticleByDOI } from "../../requests/crossref.service";
import { mongoCheckJournalExistsByISSN, mongofetchJournalByISSN } from "../../requests/mongoose.service";
import { generateMissingDOIList } from "./generateMissingDOIList";
import { getPrintAndElectronicISSN } from "./getPrintAndElectronicISSNFromCrossref";
const Integrity = db.integrity;


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
    doiLogger.info(logText)
    });

    
    const integrity = new Integrity({
      code: 4,
      message: `Jounal with ISSN ${job.data.issn} has been updated with ${missingDOIs.length} new additions`,
      data: missingDOIs ? missingDOIs : null,
    });
    integrity.save(integrity)
 }
export default updateISSN