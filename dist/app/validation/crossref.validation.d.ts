/// <reference types="hapi__joi" />
import Joi from '@hapi/joi';
import express from 'express';
/**
 * Validate the response of getting a single article from Crossref API
 * @param data express resposne from API
 * @returns Error if doesnt match
 */
export declare const articleCrossRefResponseValidation: (data: express.Response) => Joi.ValidationResult;
//# sourceMappingURL=crossref.validation.d.ts.map