const request = require('supertest');
const { bootApp, teardown } = require('../helpers/app');
const Solution = require('../../server/models/solution/solution');

let app;
let available = false;

beforeAll(async () => {
  const r = await bootApp();
  app = r.app;
  available = r.available;
  if (available) {
    const base = Date.parse('2026-01-01T00:00:00Z');
    const docs = [];
    for (let i = 0; i < 5; i++) {
      docs.push({
        id: 'bobC1P1' + i,
        username: 'bob',
        contest: 'C1',
        problem: 'P1',
        language: 'cpp',
        result: i % 2 === 0 ? 'AC' : 'WA',
        description: 'base64source',
        submitted_on: new Date(base + i * 1000),
      });
    }
    await Solution.insertMany(docs);
    await Solution.create({ id: 'otherX', username: 'carol', contest: 'C1', problem: 'P1', language: 'c' });
  }
});
afterAll(async () => { await teardown(); });

const maybe = (name, fn) => test(name, async () => { if (!available) return; await fn(); });

describe('GET /solution/history/:username', () => {
  maybe('returns only the user, paginated, newest first', async () => {
    const res = await request(app).get('/solution/history/bob?page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.total).toBe(5);
    expect(res.body.submissions).toHaveLength(2);
    // newest first
    const times = res.body.submissions.map((s) => new Date(s.submitted_on).getTime());
    expect(times[0]).toBeGreaterThanOrEqual(times[1]);
    // description is excluded from the projection
    expect(res.body.submissions[0].description).toBeUndefined();
  });

  maybe('second page returns the remainder', async () => {
    const res = await request(app).get('/solution/history/bob?page=3&limit=2');
    expect(res.body.submissions).toHaveLength(1);
  });

  maybe('limit is clamped to a sane maximum', async () => {
    const res = await request(app).get('/solution/history/bob?limit=99999');
    expect(res.body.limit).toBeLessThanOrEqual(100);
  });

  maybe('unknown user yields an empty list', async () => {
    const res = await request(app).get('/solution/history/nobody');
    expect(res.body.total).toBe(0);
    expect(res.body.submissions).toHaveLength(0);
  });
});
