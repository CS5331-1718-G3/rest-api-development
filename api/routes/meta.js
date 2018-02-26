const express = require('express');
const router = express.Router({ mergeParams: true });

// GET /meta/heartbeat - Retrieve the server heartbeat
router.get('/heartbeat', function(req, res, next) {
  res.status(200).json();
});

module.exports = router;
