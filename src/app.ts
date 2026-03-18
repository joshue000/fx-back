import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { apiRouter } from './routes';
import { metricsRouter } from './routes/metrics.route';
import { requestLogger } from './middleware/request-logger.middleware';
import { metricsMiddleware } from './middleware/metrics.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { notFoundMiddleware } from './middleware/notFound.middleware';

export function createApp(): Application {
  const app = express();

  // Swagger UI — mounted before helmet so its CSP is not blocked
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Metrics endpoint — mounted before helmet (infrastructure route, no CSP needed)
  app.use('/metrics', metricsRouter);

  // Security headers
  app.use(helmet());

  // CORS
  app.use(cors());

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Compression
  app.use(compression());

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // HTTP request logging
  app.use(requestLogger);

  // HTTP metrics collection
  app.use(metricsMiddleware);

  // Routes
  app.use('/api/v1', apiRouter);

  // 404 handler
  app.use(notFoundMiddleware);

  // Global error handler
  app.use(errorMiddleware);

  return app;
}
