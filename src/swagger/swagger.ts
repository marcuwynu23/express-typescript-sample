import type { Application } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { config } from '../config/config';

function getSwaggerPath() {
  const base = config.openAPISpecPath;

  return path.isAbsolute(base) ? base : path.join(process.cwd(), base, 'openapi.yaml');
}

export function setSwaggerUIMiddleware(app: Application) {
  if (config.swaggerEnabled) {
    const swaggerPath = YAML.load(getSwaggerPath());

    app.use(
      '/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerPath, {
        swaggerOptions: {
          persistAuthorization: true,
          urls: undefined,
        },
        customSiteTitle: 'API Docs',
        customCssUrl: 'https://unpkg.com/swagger-ui-dist/swagger-ui.css',
        customJs: [
          'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js',
          'https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js',
        ],
      })
    );
  }
}
