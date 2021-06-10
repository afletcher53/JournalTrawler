"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArticleByDOI = void 0;
const models_1 = __importDefault(require("../../models"));
const Article = models_1.default.articles;
/**
 * Determines if a Article already exists (via doi )
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {boolean} - True = journal exists, false it doesnt exist.
 */
async function getArticleByDOI(data) {
    const docCount = await Article.countDocuments({ doi: data }).exec();
    let value = false;
    if (docCount != 0) {
        value = true;
    }
    return value;
}
exports.getArticleByDOI = getArticleByDOI;
// exports.getArticleByDOI = getArticleByDOI;
