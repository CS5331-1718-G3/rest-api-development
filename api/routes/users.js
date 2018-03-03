const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router({ mergeParams: true });
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
  async function(req, res, next) {
    const { username, password, fullname, age } = req.body;

    // Form validation.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new Error('Validation failed.'));
    }

    // Check if a user with an existing username already exists.
    const count = await User.count({ username: username });
    if (count > 0) {
      return next(new Error('User already exists!'));
    }

    // Hash the password.
    const hmac = crypto.createHmac('sha512', username).update(password);
    const hash = hmac.digest('hex');

    // Create the user with password.
    const user = new User({ username, password: hash, fullname, age });
    await user.save();

    return res.status(201).json();
  }
);

// POST /users/authenticate - Authenticate an existing user
router.post(
  '/authenticate',
  [check('username').exists(), check('password').exists()],
  async function(req, res, next) {
    const { username, password } = req.body;

    // Form validation.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new Error('Validation failed.'));
    }

    // Hash the password and compare the hash.
    const hmac = crypto.createHmac('sha512', username).update(password);
    const hash = hmac.digest('hex');

    // Fail if there is no such user.
    const count = await User.count({ username, password: hash });
    if (count !== 1) {
      return next(new Error());
    }

    // Create session token and update the user.
    const uuid = uuidv4();
    await User.findOneAndUpdate({ username }, { token: uuid });

    // Return the token.
    res.status(200).json({ token: uuid });
  }
);

// POST /users/expire - Expire an authentication token.
router.post('/expire', [check('token').exists()], async function(
  req,
  res,
  next
) {
  const { token } = req.body;

  // Form validation.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error('Validation failed.'));
  }

  // Fail if there is no such user.
  const user = await User.findOne({ token });
  if (!user) {
    return next(new Error());
  }

  // Remove token from the user document.
  user.token = '';
  await user.save();

  res.status(200).json();
});

// POST /users - Retrieve authenticated user information
router.post('/', [check('token').exists()], async function(req, res, next) {
  const { token } = req.body;

  // Form validation.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error('Validation failed.'));
  }

  // Validate the token.
  const user = await User.findOne({ token });
  if (!user) {
    return next(new Error('Invalid authentication token.'));
  }

  // Return the user profile without the password field.
  return res.status(200).json({
    username: user.username,
    fullname: user.fullname,
    age: user.age,
  });
});

module.exports = router;
