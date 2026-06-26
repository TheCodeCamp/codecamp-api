// Boots the real Express app against an in-memory MongoDB for integration
// tests. Returns { available:false } when Mongo can't be started so suites can
// skip gracefully (see test/helpers/mongo.js).
const mongoose = require('mongoose');
const { startMemoryMongo, stopMemoryMongo } = require('./mongo');

function waitConnected(timeout = 20000) {
  return new Promise((resolve, reject) => {
    if (mongoose.connection.readyState === 1) return resolve();
    const t = setTimeout(() => reject(new Error('mongo connect timeout')), timeout);
    mongoose.connection.once('connected', () => { clearTimeout(t); resolve(); });
    mongoose.connection.once('error', (e) => { clearTimeout(t); reject(e); });
  });
}

async function bootApp() {
  const uri = await startMemoryMongo();
  if (!uri) return { available: false };
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = 'integration-secret';
  process.env.NODE_ENV = 'test';
  const { app } = require('../../server/app');
  await waitConnected();
  return { available: true, app };
}

async function teardown() {
  await stopMemoryMongo();
}

module.exports = { bootApp, teardown };
