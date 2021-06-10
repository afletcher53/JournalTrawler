"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJournalByISSN = void 0;
const models_1 = __importDefault(require("../../models"));
const Journal = models_1.default.journals;
/**
 * Determines if a Journal already exists (via ISSN numer)
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {boolean} - True = journal exists, false it doesnt exist.
 */
async function getJournalByISSN(data) {
    const docCount = await Journal.countDocuments({ $or: [{ issn_electronic: data }, { issn_print: data }] }).exec();
    let value = false;
    if (docCount != 0)
        value = true;
    return value;
}
exports.getJournalByISSN = getJournalByISSN;
