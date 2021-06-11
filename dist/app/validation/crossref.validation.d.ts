/// <reference types="express-serve-static-core" />
/// <reference types="hapi__joi" />
import Joi from '@hapi/joi';
/**
 * Checks if a valid journal exists from crossref API
 * @param {String} issn to be searched
 * @returns {Promise<Boolean>} true = exists on api, false = doesnt exist
 */
export declare function checkExists(issn: String): Promise<Boolean>;
export declare const articleCrossRefResponseValidation: (data: Express.Request) => Joi.ValidationResult;
export declare const articleSingleValidation: (data: any) => Joi.ValidationResult;
export declare const getJournalData: (issn: string) => Promise<any>;
//# sourceMappingURL=crossref.validation.d.ts.map