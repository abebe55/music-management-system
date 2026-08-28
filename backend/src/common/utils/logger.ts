import winston from 'winston';
import { env } from '../../config/env.config';

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const developmentFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  simple(),
);

const productionFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json(),
);

export const logger = winston.createLogger({
  level: env.node.isDev ? 'debug' : 'info',
  silent: env.node.isTest,
  format: env.node.isDev ? developmentFormat : productionFormat,
  transports: [new winston.transports.Console()],
});
