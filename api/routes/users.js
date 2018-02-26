const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router({ mergeParams: true });

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
  function(req, res, next) {
    const { username, password, fullname, age } = req.body;

    // Form validation.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        status: false,
        error: 'Validation failed.',
      });
    }

    // Check if a user with an existing username already exists,
    // otherwise create the user in the database.
    // TODO: Replace this stub method.
    if (username === 'admin') {
      return res.status(200).json({
        status: false,
        error: 'User already exists!',
      });
    }

    res.status(201).json({ status: true });
  }
);

// POST /users/authenticate - Authenticate an existing user
router.post(
  '/authenticate',
  [check('username').exists(), check('password').exists()],
  function(req, res, next) {
    const { username, password } = req.body;

    // Form validation.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ status: false });
    }

    // Authenticate a user based on username/password combo.
    // TODO: Replace this stub method.
    if (username !== 'admin' || password !== 'password') {
      return res.status(200).json({ status: false });
    }

    res.status(200).json({
      status: true,
      token: '6bf00d02-dffc-4849-a635-a21b08500d61',
    });
  }
);

// POST /users/expire - Expire an authentication token.
router.post('/expire', [check('token').exists()], function(req, res, next) {
  const { token } = req.body;

  // Form validation.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ status: false });
  }

  // Check if the token is valid and expire it.
  // TODO: Replace this stub method.
  if (token !== '6bf00d02-dffc-4849-a635-a21b08500d61') {
    return res.status(200).json({ status: false });
  }

  res.status(200).json({ status: true });
});

// POST /users - Retrieve authenticated user information
router.post('/', [check('token').exists()], function(req, res, next) {
  const { token } = req.body;

  // Form validation.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ status: false });
  }

  // Check if the token is valid and fetch user information.
  // TODO: Replace this stub method.
  if (token !== '6bf00d02-dffc-4849-a635-a21b08500d61') {
    return res.status(200).json({
      status: false,
      error: 'Invalid authentication token.',
    });
  }

  res.status(200).json({
    status: true,
    username: 'audrey123talks',
    fullname: 'Audrey Shida',
    age: 14,
  });
});

module.exports = router;
