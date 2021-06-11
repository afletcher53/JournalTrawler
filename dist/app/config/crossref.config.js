"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crossrefHeaders = exports.crossrefBaseurl = void 0;
require('dotenv').config();
exports.crossrefBaseurl = process.env.CROSSREF_BASEURL;
exports.crossrefHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Credentials': true,
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'mailto:afletcher53@gmail.com',
};
//# sourceMappingURL=crossref.config.js.map