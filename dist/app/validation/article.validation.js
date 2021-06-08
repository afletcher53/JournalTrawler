"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleSingleValidation = exports.articlePostValidation = void 0;
const Joi = require('@hapi/joi');
const options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: '',
        },
    },
};
// Article Post Validation
const articlePostValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string()
            .min(6)
            .required(),
        abstract: Joi.string()
            .min(6),
        doi: Joi.string()
            .min(6)
            .required(),
        journal: Joi.string()
            .min(6)
            .required(),
    });
    return schema.validate(data, options);
};
exports.articlePostValidation = articlePostValidation;
const articleSingleValidation = (data) => {
    const schema = Joi.object({
        id: Joi
            .string()
            .required()
            .min(6),
    });
    return schema.validate(data, options);
};
exports.articleSingleValidation = articleSingleValidation;
