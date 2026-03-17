import { AppError, NotFoundError, BadRequestError, UnauthorizedError } from '../../src/errors/AppError';
import { StatusCodes } from 'http-status-codes';

describe('AppError', () => {
  it('creates an error with the given message and status code', () => {
    const error = new AppError('Something failed', StatusCodes.BAD_GATEWAY);

    expect(error.message).toBe('Something failed');
    expect(error.statusCode).toBe(StatusCodes.BAD_GATEWAY);
    expect(error.isOperational).toBe(true);
  });

  it('defaults to 500 status code', () => {
    const error = new AppError('Internal');
    expect(error.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

describe('NotFoundError', () => {
  it('has 404 status code', () => {
    const error = new NotFoundError();
    expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

describe('BadRequestError', () => {
  it('has 400 status code', () => {
    const error = new BadRequestError();
    expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });
});

describe('UnauthorizedError', () => {
  it('has 401 status code', () => {
    const error = new UnauthorizedError();
    expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });
});
