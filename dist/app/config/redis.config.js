"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require('dotenv').config();
exports.config = {
    host: String(process.env.REDIS_HOST),
    port: Number(process.env.REDIS_PORT)
};
//# sourceMappingURL=redis.config.js.map