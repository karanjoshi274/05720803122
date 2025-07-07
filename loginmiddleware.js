// loggingMiddleware.js
const axios = require('axios');

/**
 * Reusable logging function
 * @param {string} stack - "backend" or "frontend"
 * @param {string} level - "debug", "info", "warn", "error", "fatal"
 * @param {string} pkg - e.g., "handler", "db", "controller", etc.
 * @param {string} message - Description of the event
 */
async function log(stack, level, pkg, message) {
  try {
    const response = await axios.post('http://20.244.56.144/evaluation-service/logs', {
      stack,
      level,
      package: pkg,
      message
    });
    console.log('✅ Log sent:', response.data);
  } catch (error) {
    console.error('❌ Failed to send log:', error.response ? error.response.data : error.message);
  }
}

module.exports = log;
