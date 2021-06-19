import Bull from "bull";
import winston from 'winston';
import { format, level, levels } from '../vendors/winston.vendors';

const transports = [
  // new winston.transports.Console(),
  new winston.transports.File({filename: 'logs/error/all.log', level: 'error',}),
  new winston.transports.File({filename: 'logs/error/job.log', level: 'error',}),
  new winston.transports.File({filename: 'logs/activity/all.log', level: 'info'}),
  new winston.transports.File({filename: 'logs/activity/job.log', level: 'info' }),
]

const jobLogger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
})

export default jobLogger
export function logJobFailed(type: string, job: Bull.Job<any>, error: Error) {
  jobLogger.error(`${type} Job failed with id [${job}] [${error}]`);
}
export function logJobCompleted(type: string, job: Bull.Job<any>) {
  jobLogger.info(`${type} Job completed with id [${job}]`);
}


