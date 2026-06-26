module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: [
    'server/**/*.js',
    'contest/**/*.js',
    '!**/node_modules/**',
  ],
  // Memory-Mongo spin-up can be slow on first download.
  testTimeout: 60000,
};
