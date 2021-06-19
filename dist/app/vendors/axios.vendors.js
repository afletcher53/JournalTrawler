"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
module.exports = class Service {
    /**
    *
    * @param {String} baseUrl base url for the axios object
    * @param {String} header header object for the axios object
    */
    constructor(baseUrl, header) {
        const service = axios_1.default.create({
            baseURL: baseUrl,
            headers: header,
        });
        Object.assign(this, service);
    }
};
