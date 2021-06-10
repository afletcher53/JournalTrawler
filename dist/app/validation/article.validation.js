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
    const schema = joi_1.default.object({
        print_issn: joi_1.default.string()
            .min(6)
            .required(),
        electronic_issn: joi_1.default.string()
            .min(6),
        doi: joi_1.default.string()
            .min(6)
            .required(),
    });
    return schema.validate(data, options);
};
exports.articlePostValidation = articlePostValidation;
const articleSingleValidation = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default
            .string()
            .required()
            .min(6),
    });
    return schema.validate(data, options);
};
exports.articleSingleValidation = articleSingleValidation;
