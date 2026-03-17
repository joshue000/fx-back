import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors/AppError';

export function notFoundMiddleware(_req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route ${_req.method} ${_req.path} not found`));
}
