"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDOIsFromISSN = exports.fetchJournalByISSN = exports.fetchJournalHeadByISSN = exports.fetchArticleHeadByDOI = exports.fetchJournalMetadataByISSN = exports.fetchArticleByDOI = void 0;
const axiosCrossref_vendors_1 = require("../vendors/axiosCrossref.vendors");
const fetchArticleByDOI = async (doi) => {
    const { data } = await axiosCrossref_vendors_1.http.get("/works/" + doi);
    return data;
};
exports.fetchArticleByDOI = fetchArticleByDOI;
const fetchJournalMetadataByISSN = async (issn) => {
    const data = await axiosCrossref_vendors_1.http.get("/journals/" + issn + '/works?cursor=*');
    return data;
};
exports.fetchJournalMetadataByISSN = fetchJournalMetadataByISSN;
const fetchArticleHeadByDOI = async (doi) => {
    const data = await axiosCrossref_vendors_1.http.head("/works/" + doi);
    return data;
};
exports.fetchArticleHeadByDOI = fetchArticleHeadByDOI;
const fetchJournalHeadByISSN = async (ISSN) => {
    const data = await axiosCrossref_vendors_1.http.head("/journals/" + ISSN);
    return data;
};
exports.fetchJournalHeadByISSN = fetchJournalHeadByISSN;
const fetchJournalByISSN = async (issn) => {
    const data = await axiosCrossref_vendors_1.http.get('journals/' + issn);
    return data;
};
exports.fetchJournalByISSN = fetchJournalByISSN;
const fetchDOIsFromISSN = async (issn) => {
    // const data = await getDOIsfromISSNSample(issn, 20)
    const data = await getDOIsfromISSN(issn);
    return data;
};
exports.fetchDOIsFromISSN = fetchDOIsFromISSN;
/**
 * Search CrossRef API via ISSN to return list of DOIs from it.
 * @param {String} issn ISSN to be searched on the CrossRefAPI
 * @param {Number} rows The number of results to be returned (range: 10-1000?), default 1000
 * @param {String} cursor Starting point for API search, URI string (* for start search, given by API), default *
 * @param {List} data List of DOIS generated from API search
 * @returns {List} data List of DOIS from the CrossRefAPISearch
 */
const getDOIsfromISSN = async (issn, rows, cursor, data = []) => {
    if (cursor == undefined)
        cursor = '*';
    if (rows == undefined)
        rows = 1000;
    cursor = cursor.toString();
    let url = '/journals/' + issn + '/works?rows=' + rows + '&cursor=' + encodeURIComponent(cursor);
    const response = await axiosCrossref_vendors_1.http.get(url);
    if (response.data.message['next-cursor'] == cursor)
        return data;
    data.push(...response.data.message.items);
    return getDOIsfromISSN(issn, rows, response.data.message['next-cursor'], data);
};
/**
 * Search CrossRef API via ISSN to return sample of DOIs from it.
 * @param {String} issn ISSN to be searched on the CrossRefAPI
 * @param {List} data List of DOIS generated from API search
 * @returns {Array} data List of DOIS from the CrossRefAPISearch
 */
const getDOIsfromISSNSample = async (issn, sampleSize) => {
    let data = [];
    let url = '/journals/' + issn + '/works?sample=' + sampleSize;
    const response = await axiosCrossref_vendors_1.http.get(url);
    data.push(...response.data.message.items);
    return data;
};
