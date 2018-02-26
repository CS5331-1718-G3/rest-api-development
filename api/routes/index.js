const express = require('express');
const router = express.Router();
const listEndpoints = require('express-list-endpoints');

// GET / - Retrieve the endpoint list
router.get('/', function(req, res, next) {
  // Get all implemented routes from the Express router.
  const routes = listEndpoints(res.app)
    .map(route => route.path)
    .filter(route => !route.startsWith('/internal'));

  res.status(200).json({ status: true, result: routes });
});

// Attach routes.
router.use('/meta', require('./meta'));
router.use('/users', require('./users'));
router.use('/diary', require('./diary'));

// Internal routes for testing.
router.use('/internal', require('./internal'));

module.exports = router;
