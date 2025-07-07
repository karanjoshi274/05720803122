// /middleware/logger.js
const log = require('./loggingMiddleware');

function logger(req, res, next) {
  // Example: log every incoming request
  log('backend', 'info', 'route', `Incoming request: ${req.method} ${req.url}`);
  next();
}

module.exports = logger;
