"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require('dotenv').config();
exports.config = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
};
