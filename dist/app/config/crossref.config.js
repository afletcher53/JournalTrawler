"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crossrefHeaders = exports.crossrefBaseurl = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.crossrefBaseurl = String(process.env.CROSSREF_BASEURL);
exports.crossrefHeaders = {
    Accept: 'application/json',
    'Content-Type': process.env.CONTENT_TYPE,
    'Access-Control-Allow-Credentials': true,
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'mailto:' + process.env.API_MAILTO
};
