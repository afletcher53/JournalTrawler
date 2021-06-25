"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchArticleExistsByISSNDOAJ = void 0;
const axios_DOAJ_vendors_1 = require("../vendors/axios.DOAJ.vendors");
const fetchArticleExistsByISSNDOAJ = async (issn) => {
    const url = 'journals/issn:' + issn;
    const { data } = await axios_DOAJ_vendors_1.http.get(url);
    return data;
};
exports.fetchArticleExistsByISSNDOAJ = fetchArticleExistsByISSNDOAJ;
