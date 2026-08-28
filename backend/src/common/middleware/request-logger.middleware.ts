import morgan from 'morgan';
import { logger } from '../utils/logger';
import { env } from '../../config/env.config';

const stream = {
  write: (message: string): void => {
    logger.http(message.trimEnd());
  },
};

export const requestLogger = morgan(
  env.node.isDev ? 'dev' : 'combined',
  {
    stream,
    skip: () => env.node.isTest,
  },
);
