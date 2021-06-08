"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import rateLimiterUsingThirdParty from './rateLimiter.middleware';
const logrequests_middleware_1 = __importDefault(require("./logrequests.middleware"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// const jwt = require('express-jwt');
// const jwks = require('jwks-rsa');
// const jwtCheck = jwt({
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: 'https://dev-0tvquv8m.eu.auth0.com/.well-known/jwks.json',
//   }),
//   audience: 'https://mongo-api',
//   issuer: 'https://dev-0tvquv8m.eu.auth0.com/',
//   algorithms: ['RS256'],
// });
const corsOptions = {
    origin: 'http://localhost:8081',
};
module.exports = [
    logrequests_middleware_1.default,
    helmet_1.default(),
    express_1.default.json(),
    express_1.default.urlencoded({ extended: true }),
    cors_1.default(corsOptions),
    //   jwtCheck,
    // rateLimiterUsingThirdParty,
];
//TODO: Middlewear to check connection to the REDIS database
