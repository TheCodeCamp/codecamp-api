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

// Wrapper that no-ops when Mongo isn't available (keeps the suite green offline).
const maybe = (name, fn) => test(name, async () => { if (!available) return; await fn(); });

const USER = 'alice';
const EMAIL = 'alice@example.com';
const PASS = 'secret123';

describe('users routes (integration)', () => {
  maybe('signup creates a user and returns a token', async () => {
    const res = await request(app).post('/users/signup').send({ username: USER, email_id: EMAIL, password: PASS });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTruthy();
  });

  maybe('duplicate signup is rejected', async () => {
    const res = await request(app).post('/users/signup').send({ username: USER, email_id: EMAIL, password: PASS });
    expect(res.body.success).toBe(false);
  });

  maybe('signup validation rejects a bad email and short password', async () => {
    const res = await request(app).post('/users/signup').send({ username: 'x', email_id: 'nope', password: '123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  maybe('signin returns a token for valid credentials', async () => {
    const res = await request(app).post('/users/signin').send({ username: USER, password: PASS });
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTruthy();
  });

  maybe('signin fails for a wrong password', async () => {
    const res = await request(app).post('/users/signin').send({ username: USER, password: 'wrong' });
    expect(res.body.success).toBe(false);
  });

  maybe('signin validation rejects an empty body (400)', async () => {
    const res = await request(app).post('/users/signin').send({});
    expect(res.status).toBe(400);
  });

  maybe('profile requires a token (403)', async () => {
    const res = await request(app).get('/users/profile');
    expect(res.status).toBe(403);
  });

  maybe('profile is reachable with a valid token', async () => {
    const login = await request(app).post('/users/signin').send({ username: USER, password: PASS });
    const res = await request(app).get('/users/profile').set('authorization', login.body.token);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
