"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
const article_queue_1 = require("../queues/article.queue");
const logger_1 = require("../../logger");
const crossref_service_1 = require("../requests/crossref.service");
/**
 * Starts a Journal Process Job using Bull
 * @param job Incoming Job data
 */
const journalProcess = async (job) => {
    generateJobsFromISSN(job.data.issn);
};
exports.default = journalProcess;
/**
 * Create Article jobs for all DOIS in ISSN
 * @param {String} issn to be searched on crossref
 */
const generateJobsFromISSN = async (issn) => {
    const DOIlist = await crossref_service_1.fetchDOIsFromISSN(encodeURI(issn));
    await processArticles(DOIlist);
};
const processArticles = async (DOIList) => {
    let articleList = [];
    await Promise.all(DOIList.map(async (e) => {
        const { printISSN, electronicISSN } = getPrintAndElectronicISSN(e);
        const ArticleData = {
            doi: e['DOI'],
            print_issn: printISSN,
            electronic_issn: electronicISSN
        };
        const articleJob = await article_queue_1.addArticle(ArticleData);
        articleList.push(articleJob);
        const logText = "[" + e['DOI'] + "] added to articleQueue";
        logger_1.DOILogger.info(logText);
        return articleList;
    }));
    return articleList;
};
/**
 * Return print / electronic ISSN.
 * @param issnObject Object given by CrossRef API
 * @returns issn of Print/Electronic, null if not available - String
 */
const getPrintAndElectronicISSN = (issnObject) => {
    let printISSN, electronicISSN;
    issnObject['issn-type'].forEach((element) => {
        if (printISSN == undefined)
            printISSN = element.type == 'print' ? printISSN = String(element.value) : null;
        if (electronicISSN == undefined)
            electronicISSN = element.type == 'electronic' ? electronicISSN = String(element.value) : null;
    });
    return {
        printISSN,
        electronicISSN
    };
};
