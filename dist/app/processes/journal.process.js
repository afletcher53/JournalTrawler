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
 *
 * @param {String} issn
 */
const generateJobsFromISSN = async (issn) => {
    const journalData = await crossref_service_1.fetchJournalMetadataByISSN(issn);
    crossref_service_1.fetchDOIsFromISSN(issn)
        .then((data) => {
        data.forEach((element) => {
            const { printISSN, electronicISSN } = getPrintAndElectronicISSN(element);
            const doi = {
                doi: element['DOI'],
                print_issn: printISSN,
                electronic_issn: electronicISSN
            };
            article_queue_1.addArticle(doi);
            const logText = "[" + element['DOI'] + "] added to articleQueue";
            logger_1.DOILogger.info(logText);
        });
    });
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
