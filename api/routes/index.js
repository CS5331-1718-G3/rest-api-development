const express = require('express');
const router = express.Router();
const listEndpoints = require('express-list-endpoints');

// GET / - Retrieve the endpoint list
router.get('/', function(req, res, next) {
  // Get all implemented routes from the Express router.
  const routes = listEndpoints(res.app).map(route => route.path);
  res.status(200).json(routes);
});

// Attach routes.
router.use('/meta', require('./meta'));

module.exports = router;
