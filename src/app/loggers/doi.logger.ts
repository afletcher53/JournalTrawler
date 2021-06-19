
import winston from 'winston';
import { format, level, levels } from '../vendors/winston.vendors';


const transports = [
  // new winston.transports.Console(),
  new winston.transports.File({filename: 'logs/error/all.log', level: 'error',}),
  new winston.transports.File({filename: 'logs/error/doi.log', level: 'error',}),
  new winston.transports.File({filename: 'logs/activity/all.log', level: 'info'}),
  new winston.transports.File({filename: 'logs/activity/doi.log', level: 'info' }),
]

const doiLogger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
})

export default doiLogger;