"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingDOIs = void 0;
const generateMissingDOIList_1 = __importDefault(require("./generateMissingDOIList"));
const models_1 = __importDefault(require("../../models"));
const Integrity = models_1.default.integrity;
const Journal = models_1.default.journals;
async function missingDOIs(job) {
    const journal = await Journal.findOne({
        $or: [{ issn_electronic: job.data.issn }, { issn_print: job.data.issn }]
    });
    const missingDOIs = await generateMissingDOIList_1.default(job.data.issn);
    const obj = {
        data: missingDOIs,
        issn: job.data.issn
    };
    if (missingDOIs.length > 0) {
        const integrity = new Integrity({
            code: 1,
            message: `There are ${missingDOIs.length} DOIS missing for ISSN: ${job.data.issn}`,
            journal: journal._id,
            data: obj
        });
        integrity.save(integrity);
    }
    else {
        const integrity = new Integrity({
            code: 2,
            message: `There are no missing DOIS missing for ISSN: ${job.data.issn}`,
            data: null,
            journal: journal._id
        });
        integrity.save(integrity);
    }
}
exports.missingDOIs = missingDOIs;
