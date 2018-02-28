const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router({ mergeParams: true });
const mongodb = require('../database');

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

    mongodb.connect(async (err) => {
      if (err) throw err

      const db = mongodb.getDatabase()
      const users = db.collection('users')

      // console.log(users.find({username: req.body.username}, {$exists: true}).limit(1).size())
      
      try {
        const exists = await isUserExists(users, req.body.username)
    
        if (exists) {
          return res.status(200).json({
            status: false,
            error: 'User already exists!',
          });
        } else {
          users.insertOne(req.body); 
          return res.status(201).json({ status: true });
        }        
      } catch (e) {
          throw e
      } finally {
        mongodb.disconnect() 
      }
    })
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

//Utility functions

const isUserExists = async (users, username) => {
  try {
      //Not sure why cursor.size() can't work
      const cursor = await users.find({'username' : username}).toArray()
      return cursor.length != 0
  } catch (e) {
      throw e
  }
}

const findUserByUsername = async (users, username) => {
  try {
      const results = await users.findOne(username)
      return results
  } catch (e) {
      throw e
  }
}

module.exports = router;