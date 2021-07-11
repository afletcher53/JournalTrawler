"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const doi_logger_1 = __importDefault(require("../../loggers/doi.logger"));
const system_logger_1 = __importDefault(require("../../loggers/system.logger"));
const models_1 = __importDefault(require("../../models"));
const article_queue_1 = require("../../queues/article.queue");
const crossref_service_1 = require("../../requests/crossref.service");
const mongoose_service_1 = require("../../requests/mongoose.service");
const generateMissingDOIList_1 = __importDefault(require("./generateMissingDOIList"));
const getPrintAndElectronicISSNFromCrossref_1 = __importDefault(require("./getPrintAndElectronicISSNFromCrossref"));
const Integrity = models_1.default.integrity;
const updateISSN = async (job) => {
    const checkJournalExistsMongoDB = await mongoose_service_1.mongoCheckJournalExistsByISSN(job.data.issn);
    if (!checkJournalExistsMongoDB) {
        system_logger_1.default.error('This doesnt exist on the database');
        throw Error('Journal doesnt exist on the database');
    }
    const journaldata = await mongoose_service_1.mongofetchJournalByISSN(job.data.issn);
    const missingDOIs = await generateMissingDOIList_1.default(job.data.issn);
    missingDOIs.forEach(async (element) => {
        const article = await crossref_service_1.fetchArticleByDOI(element);
        const { printISSN, electronicISSN } = getPrintAndElectronicISSNFromCrossref_1.default(article['message']);
        const ArticleData = {
            journal_id: journaldata._id,
            doi: article['message'].DOI,
            print_issn: printISSN,
            electronic_issn: electronicISSN
        };
        await article_queue_1.addArticle(ArticleData);
        const logText = `[${element['DOI']} added to articleQueue`;
        doi_logger_1.default.info(logText);
    });
    const integrity = new Integrity({
        code: 4,
        message: `Jounal with ISSN ${job.data.issn} has been updated with ${missingDOIs.length} new additions`,
        data: missingDOIs ? missingDOIs : null
    });
    integrity.save(integrity);
};
exports.default = updateISSN;
