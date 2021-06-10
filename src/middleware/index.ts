import logRequests from './logrequests.middleware';
import helmet from 'helmet';
import express from 'express';
import cors from 'cors';

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
  logRequests,
  helmet(),
  express.json(),
  express.urlencoded({extended: true}),
  cors(corsOptions),
//   jwtCheck,
];

//TODO: Middlewear to check connection to the REDIS database