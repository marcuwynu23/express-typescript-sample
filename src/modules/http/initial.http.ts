import type { Request, Response, Router } from 'express';

function welcome(_req: Request, res: Response) {
  res.json({ message: 'Hello from Express + TypeScript + esbuild!' });
}

function healthCheck(_req: Request, res: Response) {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
}

function docRedirect(_req: Request, res: Response) {
  res.redirect('/docs');
}

export function initRouterConfiguration(router: Router) {
  router.get('/', welcome);
  router.get(['/health', '/ready', '/test', '/api/health', '/api/test'], healthCheck);
  router.get(['/api', '/api/docs'], docRedirect);
}
