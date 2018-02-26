'use strict';

const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router({ mergeParams: true });

// GET /diary - Retrieve all public diary entries
router.get('/', function(req, res, next) {
  // TODO: Replace this stub method.
  const entries = [
    {
      id: 1,
      title: 'My First Project',
      author: 'ashrugged',
      publish_date: '2018-02-26T13:37:00+00:00',
      public: true,
      text:
        "If you don't know, the thing to do is not to get scared, but to learn.",
    },
    {
      id: 2,
      title: 'A New Lesson!',
      author: 'audrey123talks',
      publish_date: '2018-02-25T13:37:00+00:00',
      public: true,
      text: 'Check out my latest video!',
    },
  ];

  res.status(200).json({ status: true, result: entries });
});

// POST /diary - Retrieve all entries belonging to an authenticated user
router.post('/', [check('token').exists()], function(req, res, next) {
  const { token } = req.body;

  // Validate the token and retrieve the private diary entries.
  // TODO: Replace this stub method.
  const errors = validationResult(req);
  if (!errors.isEmpty() || token !== '6bf00d02-dffc-4849-a635-a21b08500d61') {
    return res.status(200).json({
      status: false,
      error: 'Invalid authentication token.',
    });
  }

  const entries = [
    {
      id: 2,
      title: 'A New Lesson!',
      author: 'audrey123talks',
      publish_date: '2018-02-26T13:37:00+00:00',
      public: true,
      text: 'Check out my latest video!',
    },
    {
      id: 3,
      title: 'No One Can See This Post',
      author: 'audrey123talks',
      publish_date: '2018-02-26T13:38:00+00:00',
      public: false,
      text: 'It is very secret!',
    },
  ];

  res.status(200).json({
    status: true,
    result: entries,
  });
});

// POST /diary/create - Create a new diary entry
router.post(
  '/create',
  [
    check('token').exists(),
    check('title').exists(),
    check('text').exists(),
    check('public').isBoolean(),
  ],
  function(req, res, next) {
    // `public` is reserved word in strict mode. Access using `isPublic` instead.
    const { token, title, text, public: isPublic } = req.body;

    // Validate the token.
    // TODO: Replace this stub method.
    if (token !== '6bf00d02-dffc-4849-a635-a21b08500d61') {
      return res.status(200).json({
        status: false,
        error: 'Invalid authentication token.',
      });
    }

    // Validate the form values.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        status: false,
        error: 'Validation failed.',
      });
    }

    // Add a new diary entry to the database afterwards.
    // TODO: Replace this stub method.
    const id = 2;

    res.status(201).json({
      status: true,
      result: id,
    });
  }
);

// POST /diary/delete - Delete an existing diary entry
router.post(
  '/delete',
  [
    check('token').exists(),
    check('id')
      .isInt()
      .toInt(),
  ],
  function(req, res, next) {
    const { token, id } = req.body;

    // Validate token.
    // TODO: Replace this stub method.
    if (token !== '6bf00d02-dffc-4849-a635-a21b08500d61') {
      return res.status(200).json({
        status: false,
        error: 'Invalid authentication token.',
      });
    }

    // Validate the form values.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        status: false,
        error: 'Validation failed.',
      });
    }

    // Validate that the diary entry exists and the user has permissions to delete the entry.
    // After that purge the entry from the database.
    // TODO: Replace this stub method.
    if (id !== 2) {
      return res.status(200).json({
        status: false,
        error: 'You are not allowed to perform this action.',
      });
    }

    res.status(200).json({ status: true });
  }
);

// POST /diary/permission - Adjust diary entry permissions
router.post(
  '/permission',
  [
    check('token').exists(),
    check('id')
      .isInt()
      .toInt(),
    check('public').isBoolean(),
  ],
  function(req, res, next) {
    const { token, id, public: isPublic } = req.body;

    // Validate token.
    // TODO: Replace this stub method.
    if (token !== '6bf00d02-dffc-4849-a635-a21b08500d61') {
      return res.status(200).json({
        status: false,
        error: 'Invalid authentication token.',
      });
    }

    // Validate the form values.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        status: false,
        error: 'Validation failed.',
      });
    }

    // Validate that the diary entry exists and the user has permissions to delete the entry.
    // After that modify the permissions of the diary entry.
    // TODO: Replace this stub method.
    if (id !== 2) {
      return res.status(200).json({
        status: false,
        error: 'You are not allowed to perform this action.',
      });
    }

    res.status(200).json({ status: true });
  }
);

module.exports = router;
