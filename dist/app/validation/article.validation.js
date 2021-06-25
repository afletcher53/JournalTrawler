"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleSingleValidation = exports.articlePostValidation = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
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
    const minStringValue = 6;
    const schema = joi_1.default.object({
        print_issn: joi_1.default.string()
            .min(0)
            .required(),
        electronic_issn: joi_1.default.string()
            .min(0)
            .required(),
        doi: joi_1.default.string()
            .min(minStringValue)
            .required(),
    });
    return schema.validate(data, options);
};
exports.articlePostValidation = articlePostValidation;
const articleSingleValidation = (data) => {
    const minStringValue = 6;
    const schema = joi_1.default.object({
        id: joi_1.default
            .string()
            .required()
            .min(minStringValue),
    });
    return schema.validate(data, options);
};
exports.articleSingleValidation = articleSingleValidation;
