import { Request } from 'express';
import morgan from 'morgan';
import { logger } from '../config/logger';

const stream = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};

export const requestLogger = morgan('combined', {
  stream,
  skip: (req) => (req as Request).path === '/metrics',
});
