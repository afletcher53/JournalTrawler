"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../../models"));
const crossref_service_1 = require("../../requests/crossref.service");
const Article = models_1.default.articles;
const generateMissingDOIList = async (issn) => {
    const crossrefDOISfromISSN = await crossref_service_1.fetchDOIsFromISSN(encodeURI(issn));
    const crossrefISSNDOIlist = [];
    crossrefDOISfromISSN.forEach((e) => {
        crossrefISSNDOIlist.push(e['DOI']);
    });
    const doesntExist = [];
    for (let i = 0; i <= crossrefISSNDOIlist.length - 1; i++) {
        const docCount = await Article.countDocuments({
            doi: crossrefISSNDOIlist[i]
        }).exec();
        if (docCount !== 1) {
            doesntExist.push(crossrefISSNDOIlist[i]);
        }
    }
    return doesntExist;
};
exports.default = generateMissingDOIList;
