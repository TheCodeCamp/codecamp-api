// Config is environment-driven and read once at require time, so each case
// resets the module registry and the relevant env vars.
const ENV_KEYS = ['NODE_ENV', 'MONGODB_URI', 'JWT_SECRET', 'SESSION_KEYS', 'PORT_SERVER', 'PORT', 'JUDGE_URL'];

function loadConfig(env) {
  let cfg;
  jest.isolateModules(() => {
    const saved = {};
    ENV_KEYS.forEach((k) => { saved[k] = process.env[k]; delete process.env[k]; });
    Object.assign(process.env, env);
    try {
      cfg = require('../../server/config');
    } finally {
      ENV_KEYS.forEach((k) => {
        if (saved[k] === undefined) delete process.env[k];
        else process.env[k] = saved[k];
      });
    }
  });
  return cfg;
}

describe('server/config', () => {
  test('development defaults are applied', () => {
    const cfg = loadConfig({ NODE_ENV: 'development' });
    expect(cfg.isProd).toBe(false);
    expect(cfg.mongoUri).toContain('OnlineJudge');
    expect(cfg.jwtSecret).toBeTruthy();
    expect(cfg.sessionKeys.length).toBeGreaterThanOrEqual(2);
    expect(cfg.judgeUrl).toBe('http://localhost:3001');
    expect(cfg.portServer).toBe(80);
  });

  test('explicit env values win', () => {
    const cfg = loadConfig({
      NODE_ENV: 'development',
      MONGODB_URI: 'mongodb://db:1234/X',
      JWT_SECRET: 'abc',
      SESSION_KEYS: 'a, b ,c',
      PORT_SERVER: '8080',
      JUDGE_URL: 'http://judge:9',
    });
    expect(cfg.mongoUri).toBe('mongodb://db:1234/X');
    expect(cfg.jwtSecret).toBe('abc');
    expect(cfg.sessionKeys).toEqual(['a', 'b', 'c']);
    expect(cfg.portServer).toBe(8080);
    expect(cfg.judgeUrl).toBe('http://judge:9');
  });

  test('production without JWT_SECRET throws', () => {
    expect(() => loadConfig({ NODE_ENV: 'production', SESSION_KEYS: 'k1,k2' })).toThrow(/JWT_SECRET/);
  });

  test('production without SESSION_KEYS throws', () => {
    expect(() => loadConfig({ NODE_ENV: 'production', JWT_SECRET: 's' })).toThrow(/SESSION_KEYS/);
  });

  test('production with both secrets boots', () => {
    const cfg = loadConfig({ NODE_ENV: 'production', JWT_SECRET: 's', SESSION_KEYS: 'k1,k2' });
    expect(cfg.isProd).toBe(true);
    expect(cfg.jwtSecret).toBe('s');
  });
});
