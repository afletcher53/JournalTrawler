"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../loggers/logger");
const article_queue_1 = require("../../queues/article.queue");
const crossref_service_1 = require("../../requests/crossref.service");
const mongoose_service_1 = require("../../requests/mongoose.service");
const generateMissingDOIList_1 = require("./generateMissingDOIList");
const getPrintAndElectronicISSNFromCrossref_1 = require("./getPrintAndElectronicISSNFromCrossref");
/**
 * Updates a journal based on missing DOIs list generated from Integrity check
 * First check to see if the Journal exists in the database then generate missing list of DOIS, then add them
 */
const updateISSN = async (job) => {
    const checkJournalExistsMongoDB = await mongoose_service_1.mongoCheckJournalExistsByISSN(job.data.issn);
    if (!checkJournalExistsMongoDB) {
        console.log('This doesnt exist on the database');
        throw Error('Journal doesnt exist on the database');
    }
    ;
    const journaldata = await mongoose_service_1.mongofetchJournalByISSN(job.data.issn);
    // collect list of DOIs for the issn
    const missingDOIs = await generateMissingDOIList_1.generateMissingDOIList(job.data.issn);
    //Add article jobs with the missing DOI information
    missingDOIs.forEach(async (element) => {
        const article = await crossref_service_1.fetchArticleByDOI(element);
        console.log(article['message'].DOI);
        const { printISSN, electronicISSN } = getPrintAndElectronicISSNFromCrossref_1.getPrintAndElectronicISSN(article['message']);
        const ArticleData = {
            journal_id: journaldata._id,
            doi: article['message'].DOI,
            print_issn: printISSN,
            electronic_issn: electronicISSN,
        };
        console.log(ArticleData);
        await article_queue_1.addArticle(ArticleData);
        const logText = "[" + element['DOI'] + "] added to articleQueue";
        logger_1.DOILogger.info(logText);
    });
    // const {printISSN, electronicISSN} = getPrintAndElectronicISSN(e);
    // const ArticleData = {
    //   doi: e['DOI'],
    //   print_issn: printISSN,
    //   electronic_issn: electronicISSN,
    //   journal_id: journalId
    // };
    //TODO save that the integrity has been ran to the DB
};
exports.default = updateISSN;
//# sourceMappingURL=updateJournal.js.map