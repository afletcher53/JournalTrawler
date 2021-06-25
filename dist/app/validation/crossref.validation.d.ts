/// <reference types="express-serve-static-core" />
/// <reference types="hapi__joi" />
import Joi from '@hapi/joi';
export declare const articleCrossRefResponseValidation: (data: Express.Request) => Joi.ValidationResult;
export declare const articleSingleValidation: (data: any) => Joi.ValidationResult;
export declare const getJournalData: (issn: string) => Promise<any>;
//# sourceMappingURL=crossref.validation.d.ts.map