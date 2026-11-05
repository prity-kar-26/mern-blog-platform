import winston from 'winston';
import { env } from './env';

const isProd = env.NODE_ENV === 'production';

export const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  silent: env.NODE_ENV === 'test',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    isProd
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(
            ({ timestamp, level, message, stack }) => `${timestamp} ${level}: ${stack ?? message}`,
          ),
        ),
  ),
  transports: [new winston.transports.Console()],
});