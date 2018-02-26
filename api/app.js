const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const resultWrapper = require('./middlewares/result_wrapper');

const app = express();

// Set up middlewares.
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(resultWrapper());

// Attach routes.
app.use('/', require('./routes/index'));

// Catch 404 and forward to error handler.
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Return error status, default to 500 server error.
  res.status(err.status || 500);

  // Show any errors.
  res.json(res.locals);
});

module.exports = app;
