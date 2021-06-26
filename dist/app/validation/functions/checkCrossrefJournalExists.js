"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crossref_logger_1 = __importDefault(require("../../loggers/crossref.logger"));
const crossref_service_1 = require("../../requests/crossref.service");
/**
 * Checks if a valid journal exists from crossref API
 * @param {string} issn to be searched
 * @returns {promise<boolean>} true = exists on api, false = doesnt exist
 */
const checkCrossrefJournalExists = async (issn) => {
    const statusSucess = 200;
    try {
        const res = await crossref_service_1.fetchJournalHeadByISSN(issn);
        if (typeof res !== 'undefined') {
            if (res.status === statusSucess) {
                crossref_logger_1.default.info('issn exists on crossref' + issn);
                return true;
            }
        }
        else {
            return false;
        }
    }
    catch (e) {
        crossref_logger_1.default.error(e);
    }
};
exports.default = checkCrossrefJournalExists;
