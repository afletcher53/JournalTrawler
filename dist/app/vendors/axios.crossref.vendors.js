"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_request_throttle_1 = __importDefault(require("axios-request-throttle"));
const crossref_config_1 = require("../config/crossref.config");
const crossref_logger_1 = __importDefault(require("../loggers/crossref.logger"));
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["Unauthorized"] = 401] = "Unauthorized";
    StatusCode[StatusCode["Forbidden"] = 403] = "Forbidden";
    StatusCode[StatusCode["TooManyRequests"] = 429] = "TooManyRequests";
    StatusCode[StatusCode["InternalServerError"] = 500] = "InternalServerError";
    StatusCode[StatusCode["NotFound"] = 404] = "NotFound";
})(StatusCode || (StatusCode = {}));
const headers = crossref_config_1.crossrefHeaders;
class Http {
    instance = null;
    get http() {
        return this.instance != null ? this.instance : this.initHttp();
    }
    initHttp() {
        const http = axios_1.default.create({
            baseURL: crossref_config_1.crossrefBaseurl,
            withCredentials: true,
            headers,
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
    // Handle global app errors
    // We can handle generic app errors depending on the status code
    handleError(error) {
        const { status } = error;
        switch (status) {
            case StatusCode.InternalServerError: {
                this.generateError(error);
            }
            case StatusCode.Forbidden: {
                this.generateError(error);
            }
            case StatusCode.Unauthorized: {
                this.generateError(error);
            }
            case StatusCode.TooManyRequests: {
                this.generateError(error);
            }
            case StatusCode.NotFound: {
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
