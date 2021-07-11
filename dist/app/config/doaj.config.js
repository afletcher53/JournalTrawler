"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doajHeaders = exports.doajBaseurl = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.doajBaseurl = process.env.DOAJ_BASEURL;
exports.doajHeaders = {
    Accept: 'application/json',
    'Content-Type': process.env.CONTENT_TYPE,
    'Access-Control-Allow-Credentials': true,
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'mailto:' + process.env.API_MAILTO
};
