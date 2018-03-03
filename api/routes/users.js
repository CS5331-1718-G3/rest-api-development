const express = require('express');
const router = express.Router({ mergeParams: true });
const { celebrate, Joi } = require('celebrate');
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');

const User = require('../database/user_model');

// POST /users/register - Register a new user
router.post(
  '/register',
  celebrate({
    body: {
      username: Joi.string()
        .min(1)
        .required(),
      password: Joi.string()
        .min(1)
        .required(),
      fullname: Joi.string()
        .min(1)
        .required(),
      age: Joi.number()
        .integer()
        .min(1)
        .required(),
    },
  }),
  async function(req, res, next) {
    const { username, password, fullname, age } = req.body;

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
  celebrate({
    body: {
      username: Joi.string()
        .min(1)
        .required(),
      password: Joi.string()
        .min(1)
        .required(),
    },
  }),
  async function(req, res, next) {
    const { username, password } = req.body;

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
router.post(
  '/expire',
  celebrate({
    body: {
      token: Joi.string().required(),
    },
  }),
  async function(req, res, next) {
    const { token } = req.body;

    // Fail if there is no such user.
    const user = await User.findOne({ token });
    if (!user) {
      return next(new Error());
    }

    // Remove token from the user document.
    user.token = '';
    await user.save();

    res.status(200).json();
  }
);

// POST /users - Retrieve authenticated user information
router.post(
  '/',
  celebrate({
    body: {
      token: Joi.string().required(),
    },
  }),
  async function(req, res, next) {
    const { token } = req.body;

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
  }
);

module.exports = router;
