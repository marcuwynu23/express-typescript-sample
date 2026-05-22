import type { Request, Response, Router } from 'express';

function check(_req: Request, res: Response) {
  res.json({ message: 'Hello from Express + TypeScript + esbuild!' });
}

function docRedirect(_req: Request, res: Response) {
  res.redirect('/docs');
}

export function initRouterConfiguration(router: Router) {
  router.get(['/', '/health', '/ready', '/test', '/api/health', '/api/test'], check);
  router.get(['/api', '/api/docs'], docRedirect);
}
