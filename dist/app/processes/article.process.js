"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const doi_logger_1 = __importDefault(require("../loggers/doi.logger"));
const models_1 = __importDefault(require("../models"));
const crossref_service_1 = require("../requests/crossref.service");
const crossref_validation_1 = require("../validation/crossref.validation");
const setArticleDetails_1 = __importDefault(require("./functions/setArticleDetails"));
const getArticleByDOI_1 = __importDefault(require("./functions/getArticleByDOI"));
const mongoose_service_1 = require("../requests/mongoose.service");
exports.Article = models_1.default.articles;
const articleProcess = async (job) => {
    const articleExists = await getArticleByDOI_1.default(job.data.doi);
    const articleData = await crossref_service_1.fetchArticleByDOI(job.data.doi);
    const { error } = crossref_validation_1.articleCrossRefResponseValidation(articleData);
    if (error) {
        throw Error(error.details[0].message);
    }
    const journalExistsElectronic = await mongoose_service_1.mongoCheckJournalExistsByISSN(job.data.electronic_issn);
    const journalExistsPrint = await mongoose_service_1.mongoCheckJournalExistsByISSN(job.data.print_issn);
    if (journalExistsPrint && journalExistsElectronic) {
        throw Error('The journal doesnt exist, dont add it');
    }
    if (!articleExists) {
        const article = setArticleDetails_1.default(job.data.doi, job.data.print_issn, job.data.electronic_issn, articleData, job.data.journal_id);
        try {
            article.save(article).catch((err) => {
                const logText = `[${job.data.doi}] Error processing ${err}`;
                doi_logger_1.default.error(logText);
            });
        }
        catch (e) {
            throw Error(' The article already exists');
        }
    }
};
exports.default = articleProcess;
