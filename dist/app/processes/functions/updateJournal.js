"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const doi_logger_1 = __importDefault(require("../../loggers/doi.logger"));
const models_1 = __importDefault(require("../../models"));
const article_queue_1 = require("../../queues/article.queue");
const crossref_service_1 = require("../../requests/crossref.service");
const mongoose_service_1 = require("../../requests/mongoose.service");
const generateMissingDOIList_1 = require("./generateMissingDOIList");
const getPrintAndElectronicISSNFromCrossref_1 = require("./getPrintAndElectronicISSNFromCrossref");
const Integrity = models_1.default.integrity;
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
        doi_logger_1.default.info(logText);
    });
    const integrity = new Integrity({
        code: 4,
        message: `Jounal with ISSN ${job.data.issn} has been updated with ${missingDOIs.length} new additions`,
        data: missingDOIs ? missingDOIs : null,
    });
    integrity.save(integrity);
};
exports.default = updateISSN;
