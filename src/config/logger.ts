import { createLogger, format, transports } from 'winston';
import { env } from './env';

const { combine, timestamp, colorize, printf, json } = format;

const devFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ level, message, timestamp: ts, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${ts} [${level}]: ${message}${metaStr}`;
  }),
);

const prodFormat = combine(timestamp(), json());

export const logger = createLogger({
  level: env.NODE_ENV === 'production' ? 'http' : 'debug',
  format: env.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports: [new transports.Console()],
});
