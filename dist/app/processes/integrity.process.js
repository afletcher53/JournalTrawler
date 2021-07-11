"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JobCode_enum_1 = __importDefault(require("../Typescript/Enums/JobCode.enum"));
const incompleteData_1 = require("./functions/incompleteData");
const updateISSN_1 = __importDefault(require("./functions/updateISSN"));
const saveMissingDOIs_1 = require("./functions/saveMissingDOIs");
const integrityProcess = async (job) => {
    switch (job.data.code) {
        case JobCode_enum_1.default.MISSING_DOIS:
            await saveMissingDOIs_1.missingDOIs(job);
            break;
        case JobCode_enum_1.default.DATA_COMPLETENESS_SINGLE:
            await incompleteData_1.incompleteData(job);
            break;
        case JobCode_enum_1.default.UPDATE_ISSN_SINGLE:
            await updateISSN_1.default(job);
            break;
    }
};
exports.default = integrityProcess;
