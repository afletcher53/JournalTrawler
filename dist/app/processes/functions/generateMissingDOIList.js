"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMissingDOIList = void 0;
const models_1 = __importDefault(require("../../models"));
const crossref_service_1 = require("../../requests/crossref.service");
const Article = models_1.default.articles;
/**
 * Checks a list of DOIs to see if missing from database
 * @param listtoCheck List that needs to be checked
 * @returns List of strings that dont exist in mongoose DB
 */
const generateMissingDOIList = async (issn) => {
    const crossrefDOISfromISSN = await crossref_service_1.fetchDOIsFromISSN(encodeURI(issn));
    let crossrefISSNDOIlist = [];
    crossrefDOISfromISSN.forEach((e) => {
        crossrefISSNDOIlist.push(e['DOI']);
    });
    let doesntExist = [];
    for (let i = 0; i <= crossrefISSNDOIlist.length - 1; i++) {
        const docCount = await Article.countDocuments({ doi: crossrefISSNDOIlist[i] }).exec();
        if (docCount != 1)
            doesntExist.push(crossrefISSNDOIlist[i]);
    }
    return doesntExist;
};
exports.generateMissingDOIList = generateMissingDOIList;
