"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const doaj_service_1 = require("../../requests/doaj.service");
const checkDOAJJournalExistsDOAJ = async (issn) => {
    const data = await doaj_service_1.fetchArticleExistsByISSNDOAJ(issn);
    if (data.results[0] !== undefined && 'bibjson' in data.results[0]) {
        return true;
    }
    else {
        return false;
    }
};
exports.default = checkDOAJJournalExistsDOAJ;
