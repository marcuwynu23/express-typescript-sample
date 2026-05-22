import './config/config';
import './tracer/tracer';
import { trace } from '@opentelemetry/api';
import express, { type Request, type Response } from 'express';
import { config } from './config/config';
import { httpLogger } from './middlewares/httpLogger';
import { metricsHandler, metricsMiddleware } from './middlewares/metrics';
import { setScalarMiddleware } from './scalar/scalar';

const app = express();

app.use(httpLogger);
app.use(metricsMiddleware);

app.get('/metrics', metricsHandler);

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from Express + TypeScript + esbuild!' });
});
app.get(
  ['/health', '/ready', '/test', '/api/health', '/api/test'],
  (_req: Request, res: Response) => {
    const span = trace.getActiveSpan();
    console.log('traceId:', span?.spanContext()?.traceId);
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  }
);

app.get(['/api', '/api/docs'], (_req: Request, res: Response) => {
  res.redirect('/docs');
});

setScalarMiddleware(app);

if (require.main === module) {
  app.listen(config.port, config.host, () => {
    console.log(`Server running on http://${config.host}:${config.port}`);
  });
}

export { app };
