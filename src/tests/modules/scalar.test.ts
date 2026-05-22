import express from 'express';
import request from 'supertest';

describe('modules/scalar (api-documentation)', () => {
  describe('when scalarEnabled is true', () => {
    let app: express.Application;

    beforeEach(() => {
      jest.resetModules();
      jest.mock('../../config/config', () => ({
        config: {
          scalarEnabled: true,
          openAPISpecPath: '.',
          nodeEnv: 'test',
          isTest: true,
          isProduction: false,
          isDevelopment: false,
          logLevel: 'silent',
        },
      }));
      app = express();
      const { implementAPIDocumentation } = require('../../modules/scalar/scalar');
      implementAPIDocumentation(app);
    });

    it('registers GET /openapi.yaml endpoint', () => {
      // Verify the route was registered on the app
      const routes = app._router.stack
        .filter((layer: any) => layer.route)
        .map((layer: any) => ({
          path: layer.route.path,
          method: Object.keys(layer.route.methods)[0],
        }));

      expect(routes).toContainEqual({ path: '/openapi.yaml', method: 'get' });
    });

    it('registers /docs endpoint with helmet CSP headers', async () => {
      const response = await request(app).get('/docs');

      expect(response.status).not.toBe(404);
      expect(response.headers['content-security-policy']).toBeDefined();
    });

    it('sets correct CSP directives', async () => {
      const response = await request(app).get('/docs');
      const csp = response.headers['content-security-policy'];

      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain('https://cdn.jsdelivr.net');
    });
  });

  describe('when scalarEnabled is false', () => {
    let app: express.Application;

    beforeEach(() => {
      jest.resetModules();
      jest.mock('../../config/config', () => ({
        config: {
          scalarEnabled: false,
          openAPISpecPath: '.',
          nodeEnv: 'test',
          isTest: true,
          isProduction: false,
          isDevelopment: false,
          logLevel: 'silent',
        },
      }));
      app = express();
      const { implementAPIDocumentation } = require('../../modules/scalar/scalar');
      implementAPIDocumentation(app);
    });

    it('does not register /openapi.yaml endpoint', async () => {
      const response = await request(app).get('/openapi.yaml');
      expect(response.status).toBe(404);
    });

    it('does not register /docs endpoint', async () => {
      const response = await request(app).get('/docs');
      expect(response.status).toBe(404);
    });
  });
});
