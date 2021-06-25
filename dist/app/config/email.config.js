"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailAccount = exports.emailApplicationPassword = void 0;
require('dotenv').config();
exports.emailApplicationPassword = process.env.EMAIL_APPLICATION_PASSWORD;
exports.emailAccount = process.env.EMAIL_ACCOUNT;
