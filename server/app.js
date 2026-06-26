const config = require('./config');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./utils/db/db');

const app = express();

db.connect();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.static(__dirname + '/public'));

// Health check — used by ops and the README run-check.
app.get('/health', (req, res) => {
  const dbUp = mongoose.connection.readyState === 1;
  res.status(dbUp ? 200 : 503).json({
    status: dbUp ? 'ok' : 'degraded',
    db: dbUp ? 'connected' : 'disconnected',
    uptime: process.uptime(),
  });
});

// Routes
const contest = require('./routes/contest');
const users = require('./routes/users');
const solutions = require('./routes/solution');
const rankings = require('./routes/ranking');

app.use('/contest', contest);
app.use('/users', users);
app.use('/solution', solutions);
app.use('/rankings', rankings);
app.get('/', (req, res) => res.send());

// Central error handler — async route wrappers funnel errors here so we
// always return a consistent JSON shape instead of leaking stack traces.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    msg: config.isProd ? 'Internal server error' : String(err.message || err),
  });
});

if (require.main === module) {
  app.listen(config.portServer, '0.0.0.0', () => {
    console.log(`API server listening on port ${config.portServer}`);
  });
}

module.exports = { app };
