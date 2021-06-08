"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const logger_1 = require("../../logger");
const models_1 = __importDefault(require("../models"));
const crossref_service_1 = require("../requests/crossref.service");
const crossref_validation_1 = require("../validation/crossref.validation");
exports.Article = models_1.default.articles;
/**
 * Add Article Job to the redis queue
 * @param job from the queue calling it.
 */
const articleProcess = async (job) => {
    await getArticleByDOI(job.data.doi);
    var articleData = await crossref_service_1.fetchArticleByDOI(job.data.doi);
    //Validate the data. 
    const { error } = crossref_validation_1.articleCrossRefResponseValidation(articleData);
    if (error)
        throw Error(error.details[0].message);
    //Generate the article Object.
    const article = setArticleDetails(job.data.doi, job.data.print_issn, job.data.electronic_issn, articleData);
    article
        .save(article)
        .catch((err) => {
        const logText = "[" + job.data.doi + "] Error processing " + err;
        logger_1.DOILogger.error(logText);
    });
};
exports.default = articleProcess;
const setArticleDetails = (doi, printISSN, electronicISSN, articleData) => {
    let data = articleData.message;
    let license;
    if (articleData.message.hasOwnProperty('license'))
        license = articleData.message.license[0]['URL'];
    var { publishedPrintDate, publishedOnlineDate } = getDate(articleData);
    return new exports.Article({
        crossref_url: encodeURI('https://api.crossref.org/works/' + doi),
        journal_issn_electronic: electronicISSN ? electronicISSN : null,
        journal_issn_print: printISSN ? printISSN : null,
        publisher: data.hasOwnProperty('publisher') ? data.publisher : 0,
        reference_count: data['reference-count'] ? data['reference-count'] : 0,
        is_referenced_by_count: data['is-referenced-by-count'] ? data['is-referenced-by-count'] : 0,
        published_online: publishedOnlineDate ? publishedOnlineDate : null,
        published_print: publishedPrintDate ? publishedPrintDate : null,
        type: data.type ? data.type : null,
        abstract: data.abstract ? data.abstract : null,
        title: data.title ? String(data.title) : null,
        url: data['URL'] ? data['URL'] : null,
        doi: data['DOI'] ? data['DOI'] : null,
        license: license ? license : null,
        cr_parsed: false
    });
};
/**
 * Function to extract date from the axios response.
 * @param articleData
 * @returns Two strings
 */
function getDate(articleData) {
    if (typeof articleData.message['published-online'] !== 'undefined') {
        //Set day to one if not provided
        if (!articleData.message['published-online']['date-parts'][0][2]) {
            var daytum = 1;
        }
        else {
            daytum = articleData.message['published-online']['date-parts'][0][2];
        }
        var publishedOnlineDate = new Date(Date.UTC(articleData.message['published-online']['date-parts'][0][0], (articleData.message['published-online']['date-parts'][0][1] - 1), daytum));
    }
    if (typeof articleData.message['published-print'] !== 'undefined') {
        if (!articleData.message['published-print']['date-parts'][0][2]) {
            var ppdaytum = 1;
        }
        else {
            ppdaytum = articleData.message['published-print']['date-parts'][0][2];
        }
        var publishedPrintDate = new Date(Date.UTC(articleData.message['published-print']['date-parts'][0][0], (articleData.message['published-print']['date-parts'][0][1] - 1), ppdaytum));
    }
    return { publishedPrintDate, publishedOnlineDate };
}
/**
 * Determines if a Journal already exists with MongoDB (via ISSN numer)
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {Promise<boolean>} - True = journal exists, false it doesnt exist.
 */
async function getArticleByDOI(data) {
    const docCount = await exports.Article.countDocuments({ doi: data }).exec();
    let value = false;
    if (docCount != 0) {
        value = true;
        const logText = "[" + data + "] Already exists in database ";
        logger_1.DOILogger.error(logText);
        throw new Error('Article Already Exists in the database');
    }
    return value;
}
