"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateJobsFromISSN_1 = require("./functions/generateJobsFromISSN");
const journalProcess = async (job) => {
    generateJobsFromISSN_1.generateJobsFromISSN(job.data.issn, job.data.journal_id);
};
exports.default = journalProcess;
