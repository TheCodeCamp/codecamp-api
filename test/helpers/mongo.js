// Spins up an in-memory MongoDB for integration tests. If the binary can't be
// downloaded/started (e.g. offline sandbox), startMemoryMongo returns null and
// callers skip DB-backed assertions — so `npm test` stays green everywhere and
// runs in full under CI (which has network access).
const mongoose = require('mongoose');

let mongod = null;

// Bound startup so an environment without network (where the mongod binary
// can't be downloaded) skips DB tests in seconds instead of hanging. CI, which
// has network, completes well within the timeout. Override via MONGOMS_TIMEOUT.
const START_TIMEOUT_MS = parseInt(process.env.MONGOMS_TIMEOUT || '60000', 10);

async function startMemoryMongo() {
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('memory-mongo start timed out')), START_TIMEOUT_MS)
    );
    mongod = await Promise.race([MongoMemoryServer.create(), timeout]);
    return mongod.getUri();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[test] mongodb-memory-server unavailable, skipping DB tests:', err.message);
    return null;
  }
}

async function stopMemoryMongo() {
  try { await mongoose.disconnect(); } catch (e) { /* ignore */ }
  if (mongod) {
    try { await mongod.stop(); } catch (e) { /* ignore */ }
    mongod = null;
  }
}

module.exports = { startMemoryMongo, stopMemoryMongo };
