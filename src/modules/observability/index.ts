import type { Application } from 'express';
import { httpLogger } from './logger';
import { metricsHandler, metricsMiddleware } from './metrics';

export function implementObservability(app: Application) {
  app.use(httpLogger);
  app.use(metricsMiddleware);
  app.get('/metrics', metricsHandler);
}
