"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const ioredis_1 = __importDefault(require("ioredis"));
const path_1 = __importDefault(require("path"));
const app_1 = __importDefault(require("./app"));
const redis_config_1 = require("./app/config/redis.config");
const system_logger_1 = __importDefault(require("./app/loggers/system.logger"));
const PORT = process.env.PORT;
const SSLPORT = process.env.HTTPSPORT;
const redis = new ioredis_1.default(redis_config_1.redisPort, redis_config_1.redisHost);
redis.on('connect', function () {
    const httpServer = http_1.default.createServer(app_1.default);
    const httpsServer = https_1.default.createServer({
        key: fs_1.default.readFileSync(path_1.default.join('cert', 'key.pem')),
        cert: fs_1.default.readFileSync(path_1.default.join('cert', 'cert.pem')),
    }, app_1.default);
    try {
        httpServer.listen(PORT, () => {
            system_logger_1.default.info(`Server running at: http://localhost:${PORT}`);
        });
        httpsServer.listen(SSLPORT, () => {
            system_logger_1.default.info(`Server running at: https://localhost:${SSLPORT}`);
        });
    }
    catch (e) {
        system_logger_1.default.error(e);
    }
});
