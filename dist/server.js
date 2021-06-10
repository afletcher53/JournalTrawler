'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 8080;
const SSLPORT = process.env.HTTPSPORT || 8083;
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const ioredis_1 = __importDefault(require("ioredis"));
const redisconfig = __importStar(require("./app/config/redis.config"));
const redis = new ioredis_1.default(redisconfig.config.port, redisconfig.config.host);
redis.on('connect', function () {
    const httpServer = http_1.default.createServer(app_1.default);
    const httpsServer = https_1.default.createServer({
        key: fs_1.default.readFileSync(path_1.default.join('cert', 'key.pem')),
        cert: fs_1.default.readFileSync(path_1.default.join('cert', 'cert.pem')),
    }, app_1.default);
    try {
        httpServer.listen(PORT, () => {
            console.log(`Server running at: http://localhost:${PORT}`);
        });
        httpsServer.listen(SSLPORT, () => {
            console.log(`Server running at: https://localhost:${SSLPORT}`);
        });
    }
    catch (e) {
        console.log(e);
    }
});
