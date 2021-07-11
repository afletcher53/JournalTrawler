"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoUpdateArticleAbstractById = exports.mongoFetchAllIntegrities = exports.mongoFetchAllArticles = exports.mongoArticleDeleteAll = exports.mongoArticleDeleteById = exports.mongoArticleFindByIdandUpdate = exports.mongoArticleFindById = exports.mongoArticleFindOneWhere = exports.mongoArticleFindWhere = exports.mongoDeleteAllJournals = exports.mongoFindJournalByIdAndRemove = exports.mongoFindJournalByIdAndUpdate = exports.mongoFindJournalById = exports.mongoFindJournalWhere = exports.mongoFetchAllJournals = exports.mongoSaveJournal = exports.mongofetchJournalByISSN = exports.mongoCheckArticleExistsByDOI = exports.mongoCheckJournalExistsByISSN = void 0;
const models_1 = __importDefault(require("../models"));
const Journal = models_1.default.journals;
const Article = models_1.default.articles;
const Integrity = models_1.default.integrity;
async function mongoCheckJournalExistsByISSN(data) {
    if (typeof data != 'string') {
        return false;
    }
    else {
        const docCount = await Journal.countDocuments({
            $or: [{ issn_electronic: data }, { issn_print: data }]
        }).exec();
        let value = false;
        if (docCount !== 0) {
            value = true;
        }
        return value;
    }
}
exports.mongoCheckJournalExistsByISSN = mongoCheckJournalExistsByISSN;
async function mongoCheckArticleExistsByDOI(data) {
    const docCount = await Article.countDocuments({ doi: data }).exec();
    let value = false;
    if (docCount !== 0) {
        value = true;
    }
    return value;
}
exports.mongoCheckArticleExistsByDOI = mongoCheckArticleExistsByDOI;
async function mongofetchJournalByISSN(data) {
    const journal = await Journal.find({
        $or: [{ issn_electronic: data }, { issn_print: data }]
    }).exec();
    return journal;
}
exports.mongofetchJournalByISSN = mongofetchJournalByISSN;
async function mongoSaveJournal(journal) {
    return journal.save(journal.data);
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
function mongoFindJournalById(id) {
    return Journal.findById(id);
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
    return Article.find(condition).populate('journal', 'title publisher');
}
exports.mongoArticleFindWhere = mongoArticleFindWhere;
function mongoArticleFindOneWhere(condition) {
    return Article.findOne(condition).populate('journal', 'title publisher');
}
exports.mongoArticleFindOneWhere = mongoArticleFindOneWhere;
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
function mongoUpdateArticleAbstractById(id, abstract) {
    return Article.updateOne({ _id: id }, { abstract: abstract });
}
exports.mongoUpdateArticleAbstractById = mongoUpdateArticleAbstractById;
