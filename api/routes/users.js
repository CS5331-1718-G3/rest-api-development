const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router({ mergeParams: true });
//const mongodb = require('../database');
const User = require('../database/user_model');
const uuidv4 = require('uuid/v4');

// POST /users/register - Register a new user
router.post(
  '/register',
  [
    check('username').isLength({ min: 1 }),
    check('password').isLength({ min: 1 }),
    check('fullname').isLength({ min: 1 }),
    check('age')
      .isInt()
      .custom(value => value > 0),
  ],
  function (req, res, next) {
    const { username, password, fullname, age } = req.body;

    // Form validation.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        status: false,
        error: 'Validation failed.',
      });
    }

    User.count({ username: req.body.username }, function (err, count) {
      if (count > 0) {
        return res.status(200).json({
          status: false,
          error: 'User already exists!',
        })
      } else {
        var user = new User({
          username: req.body.username,
          password: req.body.password,
          fullname: req.body.fullname,
          age: req.body.age
        });

        user.save(function (err) {
          if (err) { console.log(err.stack); return;}
          return res.status(201).json({ status: true });          
        });
      }
    });
  }
);

// POST /users/authenticate - Authenticate an existing user
router.post(
  '/authenticate',
  [check('username').exists(), check('password').exists()],
  function (req, res, next) {
    const { username, password } = req.body;

    // Form validation.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ status: false });
    }

    // Authenticate a user based on username/password combo.
    // TODO: Replace this stub method.
    // if (username !== 'admin' || password !== 'password') {
    //   return res.status(200).json({ status: false });
    // }

    User.count({ username: req.body.username, password: req.body.password }, function (err, count) {
      if (count == 1) {
        const uuid = uuidv4();
        User.findOneAndUpdate({ username: req.body.username }, { token: uuid }, function (err) {
          if (!err) {
            res.status(200).json({
              status: true,
              token: uuid,
            });
          }
        })
      } else {
        return res.status(200).json({ status: false });
      }
    });
  }
);

// POST /users/expire - Expire an authentication token.
router.post('/expire', [check('token').exists()], function (req, res, next) {
  const { token } = req.body;

  // Form validation.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ status: false });
  }

  User.findOne({ token: req.body.token }, function (err, user) {
    if (user) {
      user.token = ''
      user.save(function(err) {
        res.status(200).json({ status: true });
      })
    } else {
      return res.status(200).json({ status: false });
    }
  });
});

// POST /users - Retrieve authenticated user information
router.post('/', [check('token').exists()], function (req, res, next) {
  const { token } = req.body;

  // Form validation.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ status: false });
  }

  User.findOne({ token: req.body.token }, function (err, user) {
    if (user) {
      return res.status(200).json({
        status: true,
        result: {
          username: user.username,
          fullname: user.fullname,
          age: user.age
        }
      });
      res.status(200).json({ status: true });
    } else {
      return res.status(200).json({
        status: false,
        error: 'Invalid authentication token.'
      });
    }
  });
});

module.exports = router;