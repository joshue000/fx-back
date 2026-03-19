import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { version } from '../../package.json';
import { prisma } from '../config/database';

export const healthRouter = Router();

healthRouter.get('/', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(StatusCodes.OK).json({
      status: 'ok',
      version,
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      status: 'error',
      version,
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});
