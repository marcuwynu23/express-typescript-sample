import path from 'node:path';
import { apiReference } from '@scalar/express-api-reference';
import type { Application } from 'express';
import helmet from 'helmet';
import { config } from '../../config/config';

function getOpenAPIPath() {
  const base = config.openAPISpecPath;

  return path.isAbsolute(base) ? base : path.join(process.cwd(), base, 'openapi.yaml');
}

export function implementAPIDocumentation(app: Application) {
  if (config.scalarEnabled) {
    app.get('/openapi.yaml', (_req, res) => {
      res.sendFile(getOpenAPIPath());
    });
    app.use(
      '/docs',
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", 'https:'],
            workerSrc: ["'self'", 'blob:'],
            fontSrc: ["'self'", 'https://cdn.jsdelivr.net', 'data:'],
          },
        },
      }),
      apiReference({
        url: '/openapi.yaml',
      })
    );
  }
}
