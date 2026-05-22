import express from 'express';
import request from 'supertest';
import { implementFeatures } from '../../../modules/features';

describe('modules/features', () => {
  it('registers express.json() middleware for body parsing', async () => {
    const app = express();
    implementFeatures(app);

    // Add a test route that reads req.body
    app.post('/test', (req, res) => {
      res.json({ received: req.body });
    });

    const response = await request(app)
      .post('/test')
      .send({ hello: 'world' })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.received).toEqual({ hello: 'world' });
  });

  it('parses nested JSON bodies', async () => {
    const app = express();
    implementFeatures(app);

    app.post('/test', (req, res) => {
      res.json({ received: req.body });
    });

    const payload = { user: { name: 'John', tags: ['admin', 'user'] } };
    const response = await request(app)
      .post('/test')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.received).toEqual(payload);
  });

  it('returns empty body when no JSON is sent', async () => {
    const app = express();
    implementFeatures(app);

    app.post('/test', (req, res) => {
      res.json({ received: req.body });
    });

    const response = await request(app).post('/test');

    expect(response.status).toBe(200);
    expect(response.body.received).toEqual({});
  });
});
