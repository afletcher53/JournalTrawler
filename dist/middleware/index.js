"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const logrequests_middleware_1 = __importDefault(require("./logrequests.middleware"));
const corsOptions = {
    origin: 'http://localhost:8081'
};
module.exports = [
    logrequests_middleware_1.default,
    helmet_1.default(),
    express_1.default.json(),
    express_1.default.urlencoded({ extended: true }),
    cors_1.default(corsOptions)
];
