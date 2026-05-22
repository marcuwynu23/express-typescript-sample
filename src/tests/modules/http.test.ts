import express from 'express';
import request from 'supertest';
import { implementHTTP } from '../../modules/http';

// Mock the item routes to avoid Mongoose dependency
jest.mock('../../modules/features/item/item.routes', () => ({
  itemRoutes: require('express').Router(),
}));

describe('modules/http', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    implementHTTP(app);
  });

  describe('GET /', () => {
    it('returns welcome message', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Hello from Express + TypeScript + esbuild!',
      });
    });
  });

  describe('health endpoints', () => {
    const healthPaths = ['/health', '/ready', '/test', '/api/health', '/api/test'];

    for (const path of healthPaths) {
      it(`GET ${path} returns health payload`, async () => {
        const response = await request(app).get(path);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
        expect(typeof response.body.timestamp).toBe('string');
        expect(Number.isNaN(Date.parse(response.body.timestamp))).toBe(false);
      });
    }

    it('returns a valid ISO timestamp', async () => {
      const response = await request(app).get('/health');
      const date = new Date(response.body.timestamp);

      expect(date.toISOString()).toBe(response.body.timestamp);
    });
  });

  describe('API docs redirect', () => {
    const redirectPaths = ['/api', '/api/docs'];

    for (const path of redirectPaths) {
      it(`GET ${path} redirects to /docs`, async () => {
        const response = await request(app).get(path);

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/docs');
      });
    }
  });
});
