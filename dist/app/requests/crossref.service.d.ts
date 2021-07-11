export declare type Article = {
    doi: string;
};
export declare const fetchArticleByDOI: (doi: string) => Promise<any>;
export declare const fetchJournalMetadataByISSN: (issn: string) => Promise<any>;
export declare const fetchArticleHeadByDOI: (doi: string) => Promise<any>;
export declare const fetchJournalHeadByISSN: (ISSN: string) => Promise<any>;
export declare const fetchJournalByISSN: (issn: string) => Promise<any>;
export declare const fetchDOIsFromISSN: (issn: string) => Promise<Article[]>;
//# sourceMappingURL=crossref.service.d.ts.map