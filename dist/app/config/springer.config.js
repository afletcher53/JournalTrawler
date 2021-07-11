"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.springerHeaders = exports.springerAPIKey = exports.springerBaseurl = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.springerBaseurl = process.env.SPRINGER_BASEURL;
exports.springerAPIKey = process.env.SPRINGER_API_KEY;
exports.springerHeaders = {
    Accept: 'application/json',
    'Content-Type': process.env.CONTENT_TYPE,
    'Access-Control-Allow-Credentials': true,
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'mailto:' + process.env.API_MAILTO
};
