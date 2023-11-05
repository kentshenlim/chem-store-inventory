const { rateLimit } = require('express-rate-limit');

module.exports = function createLimiter(numLim) {
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 min
    limit: numLim,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  });
  return limiter;
};
