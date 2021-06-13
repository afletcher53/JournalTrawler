import { createLogger, format, transports } from 'winston';

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
