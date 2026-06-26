const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

const SECRET = 'unit-test-secret';

function load() {
  let verifyToken;
  jest.isolateModules(() => {
    const saved = process.env.JWT_SECRET;
    process.env.JWT_SECRET = SECRET;
    process.env.NODE_ENV = 'test';
    verifyToken = require('../../server/utils/auth/verifyToken');
    if (saved === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = saved;
  });
  const app = express();
  app.get('/secure', verifyToken, (req, res) => res.json({ ok: true, username: req.username }));
  return app;
}

describe('verifyToken middleware', () => {
  const app = load();

  test('403 when no token', async () => {
    const res = await request(app).get('/secure');
    expect(res.status).toBe(403);
    expect(res.body.auth).toBe(false);
  });

  test('500 when token invalid', async () => {
    const res = await request(app).get('/secure').set('authorization', 'not-a-jwt');
    expect(res.status).toBe(500);
    expect(res.body.auth).toBe(false);
  });

  test('passes and exposes username for a valid token', async () => {
    const token = jwt.sign({ username: 'grace' }, SECRET, { expiresIn: 60 });
    const res = await request(app).get('/secure').set('authorization', token);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, username: 'grace' });
  });
});
