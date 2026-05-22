import express from 'express';
import request from 'supertest';
import { implementObservability } from '../../modules/observability';

describe('modules/observability', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    implementObservability(app);
  });

  it('registers httpLogger middleware', async () => {
    app.get('/test-route', (_req, res) => res.json({ ok: true }));

    const response = await request(app).get('/test-route');
    expect(response.status).toBe(200);
  });

  it('registers metricsMiddleware that tracks requests', async () => {
    app.get('/tracked', (_req, res) => res.json({ tracked: true }));

    await request(app).get('/tracked');

    const metricsResponse = await request(app).get('/metrics');
    expect(metricsResponse.status).toBe(200);
    expect(metricsResponse.headers['content-type']).toMatch(/text\/plain/);
  });

  it('exposes /metrics endpoint with Prometheus format', async () => {
    app.get('/ping', (_req, res) => res.send('pong'));
    await request(app).get('/ping');

    const response = await request(app).get('/metrics');

    expect(response.status).toBe(200);
    expect(response.text).toMatch(/http_requests_total/);
    expect(response.text).toMatch(/http_request_duration_seconds/);
  });

  it('records correct method and status_code labels', async () => {
    app.get('/success', (_req, res) => res.status(200).json({ ok: true }));
    app.get('/not-found', (_req, res) => res.status(404).json({ error: 'not found' }));

    await request(app).get('/success');
    await request(app).get('/not-found');

    const response = await request(app).get('/metrics');
    expect(response.text).toMatch(/method="GET"/);
    expect(response.text).toMatch(/status_code="200"/);
    expect(response.text).toMatch(/status_code="404"/);
  });
});
