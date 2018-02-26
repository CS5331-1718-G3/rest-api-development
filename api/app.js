const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const resultWrapper = require('./middlewares/result_wrapper');
const routes = require('./routes');

const app = express();

// Set up middlewares.
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(resultWrapper());

// Add routes.
app.use('/', routes);

// Catch 404 and forward to error handler.
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  const body = { status: false };

  // Add error message only if provided.
  if (err.message && err.message.length) {
    body.error = err.message;
  }

  // Defaults to 500 Internal Server Error.
  res.status(err.status || 500);
  res.json(body);
});

module.exports = app;
