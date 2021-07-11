"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailAccount = exports.emailApplicationPassword = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.emailApplicationPassword = process.env.EMAIL_APPLICATION_PASSWORD;
exports.emailAccount = process.env.EMAIL_ACCOUNT;
