
import { NextFunction, Request, Response } from 'express';
import systemLogger from '../app/loggers/system.logger';
import getActualRequestDurationInMilliseconds  from './functions/getActualRequestDurationInMilliseconds';

/**
 * Middleware to log requests to the systemLogger
 * @param req Express request
 * @param res Express response
 * @param next Express NextFunction
 */
const logRequests = (req: Request, res: Response, next: NextFunction) => {
  const { method }  = req;
  const url = req.url;
  const status = res.statusCode;
  const start = process.hrtime();
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);

  const textlog = `[${method}:${url} ${status}] ${durationInMilliseconds.toLocaleString() + 'ms'}`;
  systemLogger.info(textlog);
  next();
};

export default logRequests;
