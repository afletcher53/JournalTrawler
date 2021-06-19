"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = exports.Journal = exports.Article = void 0;
const models_1 = __importDefault(require("../models"));
const generateMissingDOIList_1 = require("./functions/generateMissingDOIList");
const incompleteData_1 = require("./functions/incompleteData");
const updateJournal_1 = __importDefault(require("./functions/updateJournal"));
exports.Article = models_1.default.articles;
const Integrity = models_1.default.integrity;
exports.Journal = models_1.default.journals;
/**
 * Add Article Job to the redis queue
 * @param job from the queue calling it.
 * NB job.data.code refers to the type of integrity check that you need, 1 = Missing DOIs, 2 = Percentage incomplete fields
 */
const integrityProcess = async (job) => {
    switch (job.data.code) {
        case (1):
            await missingDOIs(job);
            break;
        case (2):
            await incompleteData_1.incompleteData(job);
            break;
        case (3):
            await updateJournal_1.default(job);
            break;
        case (4):
            break;
    }
};
exports.default = integrityProcess;
async function missingDOIs(job) {
    const journal = await exports.Journal.findOne({ $or: [{ issn_electronic: job.data.issn }, { issn_print: job.data.issn }] });
    const missingDOIs = await generateMissingDOIList_1.generateMissingDOIList(job.data.issn);
    let obj = {
        data: missingDOIs,
        issn: job.data.issn
    };
    if (missingDOIs.length > 0) {
        const integrity = new Integrity({
            code: 1,
            message: "There are " + missingDOIs.length + " DOIS missing for ISSN: " + job.data.issn,
            journal: journal._id,
            data: obj,
        });
        integrity.save(integrity);
    }
    else {
        const integrity = new Integrity({
            code: 2,
            message: "There are no missing DOIS missing for ISSN: " + job.data.issn,
            data: null,
            journal: journal._id,
        });
        integrity.save(integrity);
    }
}
function convert(obj, articleCount) {
    return Object.keys(obj).map(key => ({
        name: key,
        value: obj[key],
        percentage: obj[key] / articleCount * 100
    }));
}
exports.convert = convert;
