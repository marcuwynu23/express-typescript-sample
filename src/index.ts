import './config/config';
import './tracer/tracer';
import { trace } from '@opentelemetry/api';
import express, { type Request, type Response } from 'express';
import { httpLogger } from './middlewares/httpLogger';
import { metricsHandler, metricsMiddleware } from './middlewares/metrics';

const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || '0.0.0.0';

app.use(httpLogger);
app.use(metricsMiddleware);

app.get('/metrics', metricsHandler);

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from Express + TypeScript + esbuild!' });
});

app.get('/api/health', (_req: Request, res: Response) => {
  const span = trace.getActiveSpan();
  console.log('traceId:', span?.spanContext()?.traceId);
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (require.main === module) {
  app.listen(Number(port), host, () => {
    console.log(`Server running on http://${host}:${port}`);
  });
}

export { app };
