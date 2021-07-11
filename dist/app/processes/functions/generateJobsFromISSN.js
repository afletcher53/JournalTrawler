"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJobsFromISSN = void 0;
const doi_logger_1 = __importDefault(require("../../loggers/doi.logger"));
const article_queue_1 = require("../../queues/article.queue");
const crossref_service_1 = require("../../requests/crossref.service");
const getPrintAndElectronicISSNFromCrossref_1 = __importDefault(require("../functions/getPrintAndElectronicISSNFromCrossref"));
const generateJobsFromISSN = async (issn, journalId) => {
    const DOIlist = await crossref_service_1.fetchDOIsFromISSN(encodeURI(issn));
    await processArticles(DOIlist, journalId);
};
exports.generateJobsFromISSN = generateJobsFromISSN;
const processArticles = async (DOIList, journalId) => {
    const articleList = [];
    await Promise.all(DOIList.map(async (e) => {
        const { printISSN, electronicISSN } = getPrintAndElectronicISSNFromCrossref_1.default(e);
        const ArticleData = {
            doi: e['DOI'],
            print_issn: printISSN,
            electronic_issn: electronicISSN,
            journal_id: journalId
        };
        const articleJob = await article_queue_1.addArticle(ArticleData);
        articleList.push(articleJob);
        const logText = `[${e['DOI']}] added to articleQueue`;
        doi_logger_1.default.info(logText);
        return articleList;
    }));
    return articleList;
};
