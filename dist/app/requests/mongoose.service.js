"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoFetchAllIntegrities = exports.mongoFetchAllArticles = exports.mongoArticleDeleteAll = exports.mongoArticleDeleteById = exports.mongoArticleFindByIdandUpdate = exports.mongoArticleFindById = exports.mongoArticleFindWhere = exports.mongoDeleteAllJournals = exports.mongoFindJournalByIdAndRemove = exports.mongoFindJournalByIdAndUpdate = exports.mongoFindJournalById = exports.mongoFindJournalWhere = exports.mongoFetchAllJournals = exports.mongoSaveJournal = exports.mongofetchJournalByISSN = exports.mongoCheckArticleExistsByDOI = exports.mongoCheckJournalExistsByISSN = void 0;
const models_1 = __importDefault(require("../models"));
const Journal = models_1.default.journals;
const Article = models_1.default.articles;
const Integrity = models_1.default.integrity;
/**
 * Determines if a Journal already exists (via ISSN numer)
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {boolean} - True = journal exists, false it doesnt exist.
 */
async function mongoCheckJournalExistsByISSN(data) {
    const docCount = await Journal.countDocuments({ $or: [{ issn_electronic: data }, { issn_print: data }] }).exec();
    let value = false;
    if (docCount !== 0) {
        value = true;
    }
    return value;
}
exports.mongoCheckJournalExistsByISSN = mongoCheckJournalExistsByISSN;
/**
 * Determines if a Article already exists (via doi )
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {boolean} - True = journal exists, false it doesnt exist.
 */
async function mongoCheckArticleExistsByDOI(data) {
    const docCount = await Article.countDocuments({ doi: data }).exec();
    let value = false;
    if (docCount !== 0) {
        value = true;
    }
    return value;
}
exports.mongoCheckArticleExistsByDOI = mongoCheckArticleExistsByDOI;
/**
 * Determines if a Journal already exists (via ISSN numer)
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {Promise} - True = journal exists, false it doesnt exist.
 */
async function mongofetchJournalByISSN(data) {
    const journal = await Journal.find({ $or: [{ issn_electronic: data }, { issn_print: data }] }).exec();
    return journal;
}
exports.mongofetchJournalByISSN = mongofetchJournalByISSN;
async function mongoSaveJournal(journal) {
    return journal
        .save(journal.data);
}
exports.mongoSaveJournal = mongoSaveJournal;
async function mongoFetchAllJournals() {
    return Journal.find();
}
exports.mongoFetchAllJournals = mongoFetchAllJournals;
function mongoFindJournalWhere(condition) {
    return Journal.find(condition);
}
exports.mongoFindJournalWhere = mongoFindJournalWhere;
function mongoFindJournalById(req) {
    return Journal.findById(req.params.id);
}
exports.mongoFindJournalById = mongoFindJournalById;
function mongoFindJournalByIdAndUpdate(id, req) {
    return Journal.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
}
exports.mongoFindJournalByIdAndUpdate = mongoFindJournalByIdAndUpdate;
function mongoFindJournalByIdAndRemove(req) {
    return Journal.findByIdAndRemove(req.params.id, { useFindAndModify: false });
}
exports.mongoFindJournalByIdAndRemove = mongoFindJournalByIdAndRemove;
function mongoDeleteAllJournals() {
    return Journal.deleteMany({});
}
exports.mongoDeleteAllJournals = mongoDeleteAllJournals;
function mongoArticleFindWhere(condition) {
    return Article.find(condition)
        .populate('journal', 'title publisher');
}
exports.mongoArticleFindWhere = mongoArticleFindWhere;
function mongoArticleFindById(id) {
    return Article.findById(id);
}
exports.mongoArticleFindById = mongoArticleFindById;
function mongoArticleFindByIdandUpdate(id, req) {
    return Article.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
}
exports.mongoArticleFindByIdandUpdate = mongoArticleFindByIdandUpdate;
function mongoArticleDeleteById(id) {
    return Article.findByIdAndRemove(id, { useFindAndModify: false });
}
exports.mongoArticleDeleteById = mongoArticleDeleteById;
function mongoArticleDeleteAll() {
    return Article.deleteMany({});
}
exports.mongoArticleDeleteAll = mongoArticleDeleteAll;
function mongoFetchAllArticles() {
    return Article.find();
}
exports.mongoFetchAllArticles = mongoFetchAllArticles;
function mongoFetchAllIntegrities() {
    return Integrity.find();
}
exports.mongoFetchAllIntegrities = mongoFetchAllIntegrities;
