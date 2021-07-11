"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAbstractByDOIDOAJ = exports.fetchArticleExistsByISSNDOAJ = void 0;
const axios_DOAJ_vendors_1 = require("../vendors/axios.DOAJ.vendors");
const fetchArticleExistsByISSNDOAJ = async (issn) => {
    const url = 'journals/issn:' + issn;
    const { data } = await axios_DOAJ_vendors_1.http.get(url);
    return data;
};
exports.fetchArticleExistsByISSNDOAJ = fetchArticleExistsByISSNDOAJ;
const fetchAbstractByDOIDOAJ = async (doi) => {
    const doiSearch = 'doi:' + encodeURIComponent(doi);
    const url = 'articles/' + doiSearch;
    const { data } = await axios_DOAJ_vendors_1.http.get(url);
    if (typeof data.results[0] !== 'undefined') {
        return data.results[0].bibjson.abstract;
    }
    else {
        return null;
    }
};
exports.fetchAbstractByDOIDOAJ = fetchAbstractByDOIDOAJ;
