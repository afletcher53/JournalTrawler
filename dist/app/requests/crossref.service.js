"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDOIsFromISSN = exports.fetchJournalByISSN = exports.fetchJournalHeadByISSN = exports.fetchArticleHeadByDOI = exports.fetchJournalMetadataByISSN = exports.fetchArticleByDOI = void 0;
const axios_crossref_vendors_1 = require("../vendors/axios.crossref.vendors");
const fetchArticleByDOI = async (doi) => {
    const { data } = await axios_crossref_vendors_1.http.get('/works/' + doi);
    return data;
};
exports.fetchArticleByDOI = fetchArticleByDOI;
const fetchJournalMetadataByISSN = async (issn) => {
    const data = await axios_crossref_vendors_1.http.get(`/journals/${issn}/works?cursor=*`);
    return data;
};
exports.fetchJournalMetadataByISSN = fetchJournalMetadataByISSN;
const fetchArticleHeadByDOI = async (doi) => {
    const data = await axios_crossref_vendors_1.http.head(`/works/${doi}`);
    return data;
};
exports.fetchArticleHeadByDOI = fetchArticleHeadByDOI;
const fetchJournalHeadByISSN = async (ISSN) => {
    const data = await axios_crossref_vendors_1.http.head(`/journals/${ISSN}`);
    return data;
};
exports.fetchJournalHeadByISSN = fetchJournalHeadByISSN;
const fetchJournalByISSN = async (issn) => {
    const data = await axios_crossref_vendors_1.http.get(`journals/${issn}`);
    return data;
};
exports.fetchJournalByISSN = fetchJournalByISSN;
const fetchDOIsFromISSN = async (issn) => {
    const data = await getDOIsfromISSN(issn);
    return data;
};
exports.fetchDOIsFromISSN = fetchDOIsFromISSN;
const getDOIsfromISSN = async (issn, rows, cursor, data = []) => {
    const defaultRows = 1000;
    if (cursor === undefined) {
        cursor = '*';
    }
    if (rows === undefined) {
        rows = defaultRows;
    }
    cursor = cursor.toString();
    const url = '/journals/' +
        issn +
        '/works?rows=' +
        rows +
        '&cursor=' +
        encodeURIComponent(cursor);
    const response = await axios_crossref_vendors_1.http.get(url);
    if (response.data.message['next-cursor'] === cursor) {
        return data;
    }
    data.push(...response.data.message.items);
    return getDOIsfromISSN(issn, rows, response.data.message['next-cursor'], data);
};
