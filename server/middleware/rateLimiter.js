const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 30000, // Max requests per IP per window
  message: 'Too many requests from this IP, please try again later.',
});

module.exports = apiLimiter;