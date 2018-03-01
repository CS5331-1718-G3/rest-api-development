const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router({ mergeParams: true });
//const mongodb = require('../database');
const User = require('../database/user_model');
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');

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
      throw new Error('Validation failed.');
    }

    User.count({ username: req.body.username }, function (err, count) {
      if (count > 0) {
        return res.status(200).json({
          status: false,
          error: 'User already exists!',
        })
      } else {       
        const hmac = crypto.createHmac('sha512', req.body.username);
        hmac.update(req.body.password);

        var user = new User({
          username: req.body.username,
          password: hmac.digest('hex'),
          fullname: req.body.fullname,
          age: req.body.age
        });

        user.save(function (err) {
          if (err) { console.log(err.stack); return;}
          return res.status(201).json({ status: true });          
        });
      }
    });

    // Check if a user with an existing username already exists,
    // otherwise create the user in the database.
    // TODO: Replace this stub method.
    // if (username === 'admin') {
    //   throw new Error('User already exists!');
    // }

    // res.status(201).json();
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
      throw new Error('Validation failed.');
    }

    // Authenticate a user based on username/password combo.
    // TODO: Replace this stub method.
    // if (username !== 'admin' || password !== 'password') {
    //   return res.status(200).json({ status: false });
    // }
    const hmac = crypto.createHmac('sha512', req.body.username);
    hmac.update(req.body.password);

    User.count({ username: req.body.username, password: hmac.digest('hex') }, function (err, count) {
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
//=======
//   if (username !== 'admin' || password !== 'password') {
//      throw new Error();
//    }
//
//    const token = '6bf00d02-dffc-4849-a635-a21b08500d61';
//    res.status(200).json({ token });
//>>>>>>> bb7c1b04f5e65e890b6f3443515af550bdb77ab6
  }
);

// POST /users/expire - Expire an authentication token.
router.post('/expire', [check('token').exists()], function (req, res, next) {
  const { token } = req.body;

  // Form validation.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error('Validation failed.');
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
    throw new Error('Validation failed.');
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
