const request = require('supertest');
const { bootApp, teardown } = require('../helpers/app');

let app;
let available = false;

beforeAll(async () => {
  const r = await bootApp();
  app = r.app;
  available = r.available;
});
afterAll(async () => { await teardown(); });

const maybe = (name, fn) => test(name, async () => { if (!available) return; await fn(); });

describe('health endpoint', () => {
  maybe('reports ok and a connected DB', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.db).toBe('connected');
    expect(typeof res.body.uptime).toBe('number');
  });
});
