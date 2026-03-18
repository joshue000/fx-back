import { Router, Request, Response } from 'express';
import { metricsRegistry } from '../middleware/metrics.middleware';

export const metricsRouter = Router();

metricsRouter.get('/', async (_req: Request, res: Response) => {
  res.set('Content-Type', metricsRegistry.contentType);
  res.send(await metricsRegistry.metrics());
});
