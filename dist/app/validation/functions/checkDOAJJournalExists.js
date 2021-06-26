"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const doaj_logger_1 = __importDefault(require("../../loggers/doaj.logger."));
const doaj_service_1 = require("../../requests/doaj.service");
/**
 * Checks if a valid journal exists from DOAJ API
 * @param {string} issn to be searched
 * @returns {Promise<boolean>} true = exists on api, false = doesnt exist
 */
const checkDOAJJournalExistsDOAJ = async (issn) => {
    try {
        const data = await doaj_service_1.fetchArticleExistsByISSNDOAJ(issn);
        if (data.results[0] !== undefined && 'bibjson' in data.results[0]) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (e) {
        doaj_logger_1.default.error(e);
    }
};
exports.default = checkDOAJJournalExistsDOAJ;
