import 'dotenv/config';
import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './config/database';
import { logger } from './config/logger';

async function bootstrap(): Promise<void> {
  await prisma.$connect();
  logger.info('Database connected');

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await prisma.$disconnect();
      logger.info('Database disconnected');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err: unknown) => {
  logger.error('Failed to start server', { error: err });
  process.exit(1);
});
