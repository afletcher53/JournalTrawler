"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const doi_logger_1 = __importDefault(require("../../loggers/doi.logger"));
const models_1 = __importDefault(require("../../models"));
const Article = models_1.default.articles;
const checkArticlesExistsInMongoDB = async (data) => {
    const docCount = await Article.countDocuments({ doi: data }).exec();
    let value = false;
    if (docCount !== 0) {
        value = true;
        const logText = `[${data}] Already exists in database`;
        doi_logger_1.default.error(logText);
    }
    return value;
};
exports.default = checkArticlesExistsInMongoDB;
