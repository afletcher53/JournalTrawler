"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.journalISSNSingleValidation = exports.journalMultipleValidation = exports.journalSingleValidation = exports.journalPostValidation = void 0;
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const journalPostValidation = (data) => {
    const schema = Joi.object({
        issn: Joi.string()
            .min(6)
            .required(),
        title: Joi.string()
            .min(6),
        id: Joi.string(),
    });
    return schema.validate(data);
};
exports.journalPostValidation = journalPostValidation;
const journalSingleValidation = (data) => {
    const schema = Joi.object({
        id: Joi
            .objectId()
            .required(),
        publisher: Joi
            .string(),
        issn_electronic: Joi
            .string()
            .min(6),
    });
    return schema.validate(data);
};
exports.journalSingleValidation = journalSingleValidation;
const journalMultipleValidation = (data) => {
    const schema = Joi.object().keys({
        issns: Joi.array().items(Joi.string()),
    });
    return schema.validate(data);
};
exports.journalMultipleValidation = journalMultipleValidation;
const journalISSNSingleValidation = (data) => {
    const schema = Joi.object({
        id: Joi
            .string()
            .required(),
    });
    return schema.validate(data);
};
exports.journalISSNSingleValidation = journalISSNSingleValidation;
