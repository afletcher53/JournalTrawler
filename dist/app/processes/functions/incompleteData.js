"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incompleteData = void 0;
const models_1 = __importDefault(require("../../models"));
const integrity_process_1 = require("../integrity.process");
const Article = models_1.default.articles;
const Integrity = models_1.default.integrity;
async function incompleteData(job) {
    // grab all articles with the ISSN
    const journal = await integrity_process_1.Journal.findOne({ $or: [{ issn_electronic: job.data.issn }, { issn_print: job.data.issn }] });
    const articles = await Article.find({ 'journal': journal._id });
    var totalFieldCount = articles.length * Object.keys(Article.schema.paths).length;
    var totalFieldCountNotNull = 0;
    let individualFields = {
        _id: 0,
        crossref_url: 0,
        journal_issn_electronic: 0,
        journal_issn_print: 0,
        publisher: 0,
        reference_count: 0,
        is_referenced_by_count: 0,
        published_online: 0,
        published_print: 0,
        type: 0,
        abstract: 0,
        title: 0,
        url: 0,
        doi: 0,
        license: 0,
        cr_parsed: 0,
        journal: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0
    };
    articles.forEach((element) => {
        if (element._id != null)
            totalFieldCountNotNull++, individualFields._id++;
        if (element.title != null)
            totalFieldCountNotNull++, individualFields.title++;
        if (element.crossref_url != null)
            totalFieldCountNotNull++, individualFields.crossref_url++;
        if (element.publisher != null)
            totalFieldCountNotNull++, individualFields.publisher++;
        if (element.journal_issn_electronic != null)
            totalFieldCountNotNull++, individualFields.journal_issn_electronic++;
        if (element.journal_issn_print != null)
            totalFieldCountNotNull++, individualFields.journal_issn_print++;
        if (element.reference_count != null)
            totalFieldCountNotNull++, individualFields.reference_count++;
        if (element.is_referenced_by_count != null)
            totalFieldCountNotNull++, individualFields.is_referenced_by_count++;
        if (element.published_online != null)
            totalFieldCountNotNull++, individualFields.published_online++;
        if (element.published_print != null)
            totalFieldCountNotNull++, individualFields.published_print++;
        if (element.type != null)
            totalFieldCountNotNull++, individualFields.type++;
        if (element.abstract != null)
            totalFieldCountNotNull++, individualFields.abstract++;
        if (element.url != null)
            totalFieldCountNotNull++, individualFields.url++;
        if (element.createdAt != null)
            totalFieldCountNotNull++, individualFields.createdAt++;
        if (element.updatedAt != null)
            totalFieldCountNotNull++, individualFields.updatedAt++;
        if (element.license != null)
            totalFieldCountNotNull++, individualFields.license++;
        if (element.doi != null)
            totalFieldCountNotNull++, individualFields.doi++;
        if (element.cr_parsed != null)
            totalFieldCountNotNull++, individualFields.cr_parsed++;
        if (element.journal != null)
            totalFieldCountNotNull++, individualFields.journal++;
        if (element.__v != null)
            totalFieldCountNotNull++, individualFields.__v++;
    });
    const percentageFilled = totalFieldCountNotNull / totalFieldCount * 100;
    const resultObj = {
        articlesParsed: articles.length,
        totalArticleFieldsAvailable: totalFieldCount,
        totalPercentageFieldsFilled: percentageFilled,
        dataBreakdown: integrity_process_1.convert(individualFields, articles.length)
    };
    const integrity = new Integrity({
        code: 3,
        message: `Out of ${articles.length} articles, with a total of ${totalFieldCount} Article fields available, ${percentageFilled}% were filled`,
        journal: journal._id,
        data: resultObj,
    });
    integrity.save(integrity);
}
exports.incompleteData = incompleteData;
