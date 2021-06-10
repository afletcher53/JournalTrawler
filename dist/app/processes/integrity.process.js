"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const models_1 = __importDefault(require("../models"));
const crossref_service_1 = require("../requests/crossref.service");
exports.Article = models_1.default.articles;
const Integrity = models_1.default.integrity;
/**
 * Add Article Job to the redis queue
 * @param job from the queue calling it.
 */
const integrityProcess = async (job) => {
    // //check for integrity
    const crossrefDOISfromISSN = await crossref_service_1.fetchDOIsFromISSN(encodeURI(job.data.issn));
    let crossrefISSNDOIlist = [];
    crossrefDOISfromISSN.forEach((e) => {
        crossrefISSNDOIlist.push(e['DOI']);
    });
    const missingDOIs = await generateMissingDOIList(crossrefISSNDOIlist);
    let obj = {
        data: missingDOIs,
        issn: job.data.issn
    };
    if (missingDOIs.length > 0) {
        const integrity = new Integrity({
            code: 1,
            message: "There are " + missingDOIs.length + " DOIS missing for ISSN: " + job.data.issn,
            data: obj,
        });
        integrity.save(integrity);
    }
    else {
        const integrity = new Integrity({
            code: 2,
            message: "There are no missing DOIS missing for ISSN: " + job.data.issn,
            data: null,
        });
        integrity.save(integrity);
    }
};
/**
 * Checks a list of DOIs to see if missing from database
 * @param listtoCheck List that needs to be checked
 * @returns List of strings that dont exist in mongoose DB
 */
const generateMissingDOIList = async (listtoCheck) => {
    let doesntExist = [];
    for (let i = 0; i <= listtoCheck.length - 1; i++) {
        const docCount = await exports.Article.countDocuments({ doi: listtoCheck[i] }).exec();
        if (docCount != 1)
            doesntExist.push(listtoCheck[i]);
    }
    return doesntExist;
};
exports.default = integrityProcess;
