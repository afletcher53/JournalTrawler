'use strict';
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
