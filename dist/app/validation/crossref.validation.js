"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleCrossRefResponseValidation = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const options = {
    abortEarly: false,
    allowUnknown: true,
    errors: {
        wrap: {
            label: ''
        }
    }
};
const articleCrossRefResponseValidation = (data) => {
    const schema = joi_1.default.object({
        message: joi_1.default.object().keys({
            title: joi_1.default.required(),
            DOI: joi_1.default.required(),
            abstract: joi_1.default.string(),
            publisher: joi_1.default.required(),
            'reference-count': joi_1.default.required(),
            'is-referenced-by-count': joi_1.default.required(),
            type: joi_1.default.required(),
            URL: joi_1.default.required()
        })
    });
    return schema.validate(data, options);
};
exports.articleCrossRefResponseValidation = articleCrossRefResponseValidation;
