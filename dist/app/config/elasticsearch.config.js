"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const elasticSearchUrl = process.env.ELASTICSEARCH_URL || 'localhost';
const elasticSearchPort = Number(process.env.ELASTICSEARCH_PORT) || 9200;
const elasticSearchPassword = process.env.ELASTICSEARCH_USERNAME || '';
const elasticSearchUsername = process.env.ELASTICSEARCH_PASSWORD || '';
const elasticSearchProtocol = process.env.ELASTICSEARCH_PROTOCOL || 'http';
exports.default = {
    host: elasticSearchUrl,
    port: elasticSearchPort,
    protocol: elasticSearchProtocol,
    auth: `${elasticSearchUsername}:${elasticSearchPassword}`
};
