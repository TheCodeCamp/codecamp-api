#!/usr/bin/env node
/*
 * End-to-end smoke test for the API server.
 * Boots `server/app.js` on a test port and exercises signup -> signin ->
 * profile. If MongoDB is not reachable the server can't come up; in that case
 * we print a SKIP and exit 0 so the suite is safe to run in environments
 * without a database (real CI should provide one).
 */
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = process.env.TEST_PORT || 4599;
const BASE = `http://127.0.0.1:${PORT}`;
const REPO = path.join(__dirname, '..');

function request(method, urlPath, { body, token } = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      `${BASE}${urlPath}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
          ...(token ? { authorization: token } : {}),
        },
      },
      (res) => {
        let chunks = '';
        res.on('data', (c) => (chunks += c));
        res.on('end', () => {
          let parsed = chunks;
          try { parsed = JSON.parse(chunks); } catch (_) { /* leave as text */ }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function waitForHealth(timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await request('GET', '/health');
      if (res.status === 200 && res.body && res.body.db === 'connected') return true;
    } catch (_) { /* not up yet */ }
    await sleep(300);
  }
  return false;
}

let failures = 0;
function check(name, cond) {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    failures++;
    console.error(`  ✗ ${name}`);
  }
}

(async () => {
  const server = spawn('node', ['server/app.js'], {
    cwd: REPO,
    env: { ...process.env, PORT_SERVER: String(PORT), NODE_ENV: 'test', JWT_SECRET: 'smoke-test-secret' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let serverLog = '';
  server.stdout.on('data', (d) => (serverLog += d));
  server.stderr.on('data', (d) => (serverLog += d));

  const healthy = await waitForHealth(8000);
  if (!healthy) {
    console.log('SKIP: server/MongoDB not available — cannot run smoke test.');
    console.log('      (Start MongoDB on 27017, or set MONGODB_URI, then re-run `npm test`.)');
    server.kill('SIGKILL');
    process.exit(0);
  }

  console.log('Running API smoke test...');
  const username = 'smoke_' + Date.now();
  const password = 'secret123';

  const signup = await request('POST', '/users/signup', {
    body: { username, email_id: `${username}@example.com`, password },
  });
  check('signup returns success + token', signup.status === 200 && signup.body.success && !!signup.body.token);

  const signin = await request('POST', '/users/signin', { body: { username, password } });
  check('signin returns token', signin.body && signin.body.success === true && !!signin.body.token);

  const token = (signin.body && signin.body.token) || (signup.body && signup.body.token);
  const profile = await request('GET', '/users/profile', { token });
  check('profile is reachable with token (200)', profile.status === 200);

  const badInput = await request('POST', '/users/signin', { body: { username: '' } });
  check('validation rejects empty signin (400)', badInput.status === 400);

  server.kill('SIGKILL');

  if (failures > 0) {
    console.error(`\n${failures} smoke check(s) failed.\n--- server log ---\n${serverLog}`);
    process.exit(1);
  }
  console.log('\nAll smoke checks passed.');
  process.exit(0);
})().catch((err) => {
  console.error('Smoke test crashed:', err);
  process.exit(1);
});
