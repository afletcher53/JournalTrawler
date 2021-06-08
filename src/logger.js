const {transports, createLogger, format} = require('winston'); // TODO Convert to TS

const articleLogger = createLogger({
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

const systemLogger = createLogger({
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

const crossRefLogger = createLogger({
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

const DOILogger = createLogger({
  format: format.combine(
      format.timestamp(),
      format.json(),
  ),
  transports: [
    // new transports.Console(),
    new transports.File({filename: 'logs/error/doi_error.log', level: 'error'}),
    new transports.File(
        {filename: 'logs/activity/doi.log', level: 'info'}),
  ],
});


module.exports = {
  articleLogger: articleLogger,
  systemLogger: systemLogger,
  crossRefLogger: crossRefLogger,
  DOILogger: DOILogger,
};
