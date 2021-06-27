/**
 * Determines if a Journal already exists (via ISSN numer)
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {boolean} - True = journal exists, false it doesnt exist.
 */
export declare function mongoCheckJournalExistsByISSN(data: any): Promise<boolean>;
/**
 * Determines if a Article already exists (via doi )
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {boolean} - True = journal exists, false it doesnt exist.
 */
export declare function mongoCheckArticleExistsByDOI(data: any): Promise<boolean>;
/**
 * Determines if a Journal already exists (via ISSN numer)
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {Promise} - True = journal exists, false it doesnt exist.
 */
export declare function mongofetchJournalByISSN(data: any): Promise<any>;
export declare function mongoSaveJournal(journal: any): Promise<any>;
export declare function mongoFetchAllJournals(): Promise<any>;
export declare function mongoFindJournalWhere(condition: any): any;
export declare function mongoFindJournalById(req: any): any;
export declare function mongoFindJournalByIdAndUpdate(id: any, req: any): any;
export declare function mongoFindJournalByIdAndRemove(req: any): any;
export declare function mongoDeleteAllJournals(): any;
export declare function mongoArticleFindWhere(condition: any): any;
export declare function mongoArticleFindById(id: any): any;
export declare function mongoArticleFindByIdandUpdate(id: any, req: any): any;
export declare function mongoArticleDeleteById(id: any): any;
export declare function mongoArticleDeleteAll(): any;
export declare function mongoFetchAllArticles(): any;
export declare function mongoFetchAllIntegrities(): any;
//# sourceMappingURL=mongoose.service.d.ts.map