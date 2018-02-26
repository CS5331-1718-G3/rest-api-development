var express = require('express');
var router = express.Router();

// GET / - Retrieve the endpoint list
router.get('/', function(req, res, next) {
  // Get all implemented routes from the Express router.
  const routes = router.stack
    .map(r => r.route && r.route.path)
    .filter(r => !!r);

  res.status(200).json(routes);
});

module.exports = router;
