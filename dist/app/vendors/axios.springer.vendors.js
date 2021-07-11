"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_request_throttle_1 = __importDefault(require("axios-request-throttle"));
const springer_config_1 = require("../config/springer.config");
const crossref_logger_1 = __importDefault(require("../loggers/crossref.logger"));
const HttpStatusCode_enum_1 = __importDefault(require("../Typescript/Enums/HttpStatusCode.enum"));
const headers = springer_config_1.springerHeaders;
class Http {
    constructor() {
        this.instance = null;
    }
    get http() {
        return this.instance != null ? this.instance : this.initHttp();
    }
    initHttp() {
        const http = axios_1.default.create({
            baseURL: springer_config_1.springerBaseurl,
            withCredentials: true,
            headers
        });
        http.interceptors.response.use((response) => {
            crossref_logger_1.default.info(`[RESPONSE: ${response.config.method} ${response.status}] URL:${response.config.url}]`);
            return response;
        }, (error) => {
            const { response } = error;
            crossref_logger_1.default.error(error);
            return this.handleError(response);
        });
        http.interceptors.request.use((config) => {
            crossref_logger_1.default.info(`[REQUEST: ${config.method}] URL:${config.url}]`);
            return config;
        }, (error) => {
            crossref_logger_1.default.error(error);
            return Promise.reject(error);
        });
        axios_request_throttle_1.default.use(http, { requestsPerSecond: 5 });
        this.instance = http;
        return http;
    }
    request(config) {
        return this.http.request(config);
    }
    get(url, config) {
        return this.http.get(url, config);
    }
    head(url, config) {
        return this.http.head(url, config);
    }
    handleError(error) {
        const { status } = error;
        switch (status) {
            case HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR: {
                this.generateError(error);
            }
            case HttpStatusCode_enum_1.default.FORBIDDEN: {
                this.generateError(error);
            }
            case HttpStatusCode_enum_1.default.UNAUTHORIZED: {
                this.generateError(error);
            }
            case HttpStatusCode_enum_1.default.TOO_MANY_REQUESTS: {
                this.generateError(error);
            }
            case HttpStatusCode_enum_1.default.NOT_FOUND: {
                this.generateError(error);
            }
            default:
                this.generateError(error);
        }
        return Promise.reject(error);
    }
    generateError(error) {
        crossref_logger_1.default.error(error);
        return crossref_logger_1.default.error(`[${error.status}: ${error.config.method} ${error.config.url}:]`);
    }
}
exports.http = new Http();
