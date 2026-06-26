// Single MongoDB connector shared by the API server. Importing this module
// establishes (or reuses) the one mongoose connection for the process.
const mongoose = require('mongoose');
const config = require('./../../config');

mongoose.Promise = global.Promise;

let connected = false;
function connect() {
  if (connected) return mongoose.connection;
  connected = true;
  mongoose
    .connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`MongoDB connected: ${config.mongoUri}`))
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
  return mongoose.connection;
}

module.exports = { mongoose, connect };
