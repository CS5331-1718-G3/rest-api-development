const express = require('express');
const router = express.Router({ mergeParams: true });

// GET /internal/error - For testing error handlers.
router.get('/error', function(req, res, next) {
  const err = new Error('Custom error message');
  err.status = 200;
  return next(err);
});

module.exports = router;
