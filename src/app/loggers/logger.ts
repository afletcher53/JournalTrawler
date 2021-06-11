import { createLogger, format, transports } from 'winston';

export const articleLogger = createLogger({
  format: format.combine(
      format.timestamp(),
      format.json(),
  ),
  transports: [
    // new transports.Console(),
    new transports.File({filename: 'logs/error/error.log', level: 'error'}),
    new transports.File(
        {filename: 'logs/activity/activity.log', level: 'info'}),
  ],
});

export const systemLogger = createLogger({
  format: format.combine(
      format.timestamp(),
      format.json(),
  ),
  transports: [
    // new transports.Console(),
    new transports.File({filename: 'logs/error/error.log', level: 'error'}),
    new transports.File(
        {filename: 'logs/activity/activity.log', level: 'info'}),
  ],
});
export const mongoDBLogger = createLogger({
  format: format.combine(
      format.timestamp(),
      format.json(),
  ),
  transports: [
    // new transports.Console(),
    new transports.File({
      filename: 'logs/error/mongodb_error.log', level: 'error'}),
    new transports.File(
        {filename: 'logs/activity/mongodb_activity.log', level: 'info'}),
  ],
});

export const crossRefLogger = createLogger({
  format: format.combine(
      format.timestamp(),
      format.json(),
  ),
  transports: [
    new transports.Console(),
    new transports.File(
        {filename: 'logs/error/crossref_error.log', level: 'error'}),
    new transports.File(
        {filename: 'logs/activity/crossref_activity.log', level: 'info'}),
  ],
});

export const jobLogger = createLogger({
  format: format.combine(
      format.timestamp(),
      format.json(),
  ),
  transports: [
    new transports.Console(),
    new transports.File(
        {filename: 'logs/error/job_error.log', level: 'error'}),
    new transports.File(
        {filename: 'logs/activity/job_activity.log', level: 'info'}),
  ],
});

export const DOILogger = createLogger({
  format: format.combine(
      format.timestamp(),
      format.json(),
  ),
  transports: [
    new transports.File({filename: 'logs/error/doi_error.log', level: 'error'}),
    new transports.File(
        {filename: 'logs/activity/doi.log', level: 'info'}),
  ],
});

