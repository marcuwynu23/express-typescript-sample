import { trace } from '@opentelemetry/api';
import { type Application, type Request, type Response, Router } from 'express';

export function implementHTTP(app: Application) {
  const router = Router();

  router.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'Hello from Express + TypeScript + esbuild!' });
  });
  router.get(
    ['/health', '/ready', '/test', '/api/health', '/api/test'],
    (_req: Request, res: Response) => {
      const span = trace.getActiveSpan();
      console.log('traceId:', span?.spanContext()?.traceId);
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    }
  );

  router.get(['/api', '/api/docs'], (_req: Request, res: Response) => {
    res.redirect('/docs');
  });
  app.use(router);
}
