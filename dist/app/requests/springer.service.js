"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAbstractByDOISpringer = exports.checkJournalExistsByISSN = void 0;
const springer_config_1 = require("../config/springer.config");
const axios_springer_vendors_1 = require("../vendors/axios.springer.vendors");
const checkJournalExistsByISSN = async (issn) => {
    const issnSearch = 'issn:' + encodeURIComponent(issn);
    const apiKey = '&api_key=' + encodeURIComponent(springer_config_1.springerAPIKey);
    const url = 'metadata/json?q=' + issnSearch + apiKey;
    const { data } = await axios_springer_vendors_1.http.get(url);
    if (data.result[0].total > 1) {
        return true;
    }
    else {
        return false;
    }
};
exports.checkJournalExistsByISSN = checkJournalExistsByISSN;
const fetchAbstractByDOISpringer = async (doi) => {
    const doiSearch = '(doi:' + encodeURIComponent(doi) + ')';
    const apiKey = '&api_key=' + encodeURIComponent(springer_config_1.springerAPIKey);
    const url = 'meta/v2/json?q=' + doiSearch + apiKey;
    const { data } = await axios_springer_vendors_1.http.get(url);
    if (data.records[0]) {
        return data.records[0].abstract;
    }
    else {
        return null;
    }
};
exports.fetchAbstractByDOISpringer = fetchAbstractByDOISpringer;
