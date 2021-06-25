export declare type Article = {
    doi: String;
};
export declare const fetchArticleByDOI: (doi: String) => Promise<any>;
export declare const fetchJournalMetadataByISSN: (issn: String) => Promise<any>;
export declare const fetchArticleHeadByDOI: (doi: String) => Promise<any>;
export declare const fetchJournalHeadByISSN: (ISSN: String) => Promise<any>;
export declare const fetchJournalByISSN: (issn: String) => Promise<any>;
export declare const fetchDOIsFromISSN: (issn: String) => Promise<Article[]>;
/**
 * Search CrossRef API via ISSN to return sample of DOIs from it.
 * @param {String} issn ISSN to be searched on the CrossRefAPI
 * @param {List} data List of DOIS generated from API search
 * @returns {Array} data List of DOIS from the CrossRefAPISearch
 */
//# sourceMappingURL=crossref.service.d.ts.map