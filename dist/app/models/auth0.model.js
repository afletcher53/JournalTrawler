"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const auth0 = {
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    url: process.env.AUTH0_URL,
    audience: process.env.AUTH0_AUDIENCE,
};
exports.default = { auth0 };
//# sourceMappingURL=auth0.model.js.map