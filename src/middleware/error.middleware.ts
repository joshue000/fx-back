import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';

function requestContext(req: Request): Record<string, unknown> {
  return {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
  };
}

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    logger.warn('Validation error', {
      ...requestContext(req),
      errors: err.flatten().fieldErrors,
    });

    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof AppError) {
    const context = { ...requestContext(req), message: err.message };

    if (err.statusCode >= StatusCodes.INTERNAL_SERVER_ERROR) {
      logger.error('Application error', { ...context, stack: err.stack });
    } else {
      logger.warn('Application error', context);
    }

    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  logger.error('Unhandled error', {
    ...requestContext(req),
    error: err.message,
    stack: err.stack,
  });

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Internal server error',
  });
}
