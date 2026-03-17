import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof AppError) {
    if (err.statusCode >= StatusCodes.INTERNAL_SERVER_ERROR) {
      logger.error(err.message, { stack: err.stack });
    }

    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  logger.error('Unhandled error', { error: err.message, stack: err.stack });

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Internal server error',
  });
}
