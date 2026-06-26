// Central runtime configuration for the API server.
// All environment access happens here so the rest of the codebase reads
// from one consistent place instead of scattered process.env lookups.
require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

// Secrets must be supplied explicitly in production; in development we fall
// back to clearly-labelled insecure defaults so the app still boots.
function secret(name, devFallback) {
  const value = process.env[name];
  if (!value) {
    if (isProd) {
      throw new Error(`Missing required environment variable ${name} in production`);
    }
    return devFallback;
  }
  return value;
}

const sessionKeysRaw = process.env.SESSION_KEYS;
const sessionKeys = sessionKeysRaw
  ? sessionKeysRaw.split(',').map((k) => k.trim()).filter(Boolean)
  : isProd
    ? (() => { throw new Error('Missing required environment variable SESSION_KEYS in production'); })()
    : ['dev-key-1', 'dev-key-2'];

module.exports = {
  nodeEnv,
  isProd,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/OnlineJudge',
  jwtSecret: secret('JWT_SECRET', 'dev-insecure-secret-change-me'),
  sessionKeys,
  portServer: parseInt(process.env.PORT_SERVER || process.env.PORT || '80', 10),
  judgeUrl: process.env.JUDGE_URL || 'http://localhost:3001',
};
