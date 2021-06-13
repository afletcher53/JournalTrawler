import chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';
import systemLogger from '../app/loggers/system.logger';

const getActualRequestDurationInMilliseconds = (start: [number, number]) => {
  const NS_PER_SEC = 1e9; // convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};


/**
 * Middleware to log requests to the systemLogger
 * @param req Express request
 * @param res Express response
 * @param next Express NextFunction
 */
const logRequests = (req: Request, res: Response, next: NextFunction) => {
  const current_datetime = new Date();
  const formatted_date =
    current_datetime.getFullYear() +
    '-' +
    (current_datetime.getMonth() + 1) +
    '-' +
    current_datetime.getDate() +
    ' ' +
    current_datetime.getHours() +
    ':' +
    current_datetime.getMinutes() +
    ':' +
    current_datetime.getSeconds();
  const method = req.method;
  const url = req.url;
  const status = res.statusCode;
  const start = process.hrtime();
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
  const log = `[${chalk.blue(formatted_date)}] ${method}:${url} ${status} ${chalk.red(durationInMilliseconds.toLocaleString() + 'ms')}`;
  console.log(log)
  const textlog = `[${method}:${url} ${status}] ${durationInMilliseconds.toLocaleString() + 'ms'}`;
  systemLogger.info(textlog);
  next();
};

export default logRequests