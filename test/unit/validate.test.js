const express = require('express');
const bodyParser = require('body-parser');
const { body } = require('express-validator');
const request = require('supertest');
const { handleValidation } = require('../../server/utils/validate');

function makeApp() {
  const app = express();
  app.use(bodyParser.json());
  app.post(
    '/echo',
    [body('name').isString().trim().notEmpty(), body('age').isInt({ min: 0 })],
    handleValidation,
    (req, res) => res.json({ success: true, name: req.body.name })
  );
  return app;
}

describe('handleValidation middleware', () => {
  const app = makeApp();

  test('passes valid input through to the handler', async () => {
    const res = await request(app).post('/echo').send({ name: 'ada', age: 30 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, name: 'ada' });
  });

  test('rejects missing/invalid fields with 400 and field errors', async () => {
    const res = await request(app).post('/echo').send({ name: '', age: -1 });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    const fields = res.body.errors.map((e) => e.field).sort();
    expect(fields).toEqual(['age', 'name']);
  });
});
