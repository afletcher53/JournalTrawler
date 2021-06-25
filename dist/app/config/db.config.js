"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testurl = exports.url = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.url = process.env.DB_MONOGO_URL + process.env.DB_NAME;
exports.testurl = process.env.DB_MONOGO_URL + process.env.DB_NAME_TEST;
