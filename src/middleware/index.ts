import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import logRequests from './logrequests.middleware';

const corsOptions = {
  origin: 'http://localhost:8081'
};

module.exports = [
  logRequests,
  helmet(),
  express.json(),
  express.urlencoded({ extended: true }),
  cors(corsOptions)
];

//TODO: Middlewear to check connection to the REDIS database
