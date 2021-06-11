"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoeFindJournalWhere2 = exports.mongoDeleteAllJournals = exports.mongoFindJournalByIdAndRemove = exports.mongoFindJournalByIdAndUpdate = exports.mongoFindJournalById = exports.mongoFindJournalWhere = exports.mongoSaveJournal = exports.mongofetchJournalByISSN = exports.mongoCheckArticleExistsByDOI = exports.mongoCheckJournalExistsByISSN = void 0;
const models_1 = __importDefault(require("../models"));
const Journal = models_1.default.journals;
const Article = models_1.default.articles;
/**
 * Determines if a Journal already exists (via ISSN numer)
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {boolean} - True = journal exists, false it doesnt exist.
 */
async function mongoCheckJournalExistsByISSN(data) {
    const docCount = await Journal.countDocuments({ $or: [{ issn_electronic: data }, { issn_print: data }] }).exec();
    let value = false;
    if (docCount != 0)
        value = true;
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
    if (docCount != 0) {
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
function mongoeFindJournalWhere2(condition) {
    return Journal.find(condition);
}
exports.mongoeFindJournalWhere2 = mongoeFindJournalWhere2;
//# sourceMappingURL=mongoose.service.js.map