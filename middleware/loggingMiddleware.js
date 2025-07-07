// /middleware/loggingMiddleware.js
const axios = require('axios');

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
