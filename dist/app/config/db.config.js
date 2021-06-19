"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testurl = exports.url = void 0;
require('dotenv').config();
exports.url = process.env.DB_MONOGO_URL + process.env.DB_NAME;
exports.testurl = process.env.DB_MONOGO_URL + process.env.DB_NAME_TEST;
