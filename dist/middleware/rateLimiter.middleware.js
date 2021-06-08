"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rateLimit = require('express-rate-limit');
const rateLimiterUsingThirdParty = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 100,
    message: 'You have exceeded the 100 requests in 24 hrs limit!',
    headers: true,
});
exports.default = rateLimiterUsingThirdParty;
