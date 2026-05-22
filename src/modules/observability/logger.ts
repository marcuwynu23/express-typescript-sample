import type { Request, Response } from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { config } from '../../config/config';

export function createLogger() {
  return pino({
    level: config.logLevel,
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
    ...(config.isProduction || config.isTest
      ? {}
      : {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
              singleLine: true,
            },
          },
        }),
  });
}

const logger = createLogger();

export const httpLogger = pinoHttp({
  logger,
  customLogLevel: (_req: Request, res: Response, err?: Error) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
});
