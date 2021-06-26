/**
 * Checks if a valid journal exists from crossref API
 * @param {string} issn to be searched
 * @returns {promise<boolean>} true = exists on api, false = doesnt exist
 */
declare const checkCrossrefJournalExists: (issn: string) => Promise<boolean>;
export default checkCrossrefJournalExists;
//# sourceMappingURL=checkCrossrefJournalExists.d.ts.map