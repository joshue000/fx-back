import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, StatusCodes.NOT_FOUND);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, StatusCodes.FORBIDDEN);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, StatusCodes.CONFLICT);
  }
}
