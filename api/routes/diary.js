'use strict';

const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router({ mergeParams: true });

const User = require('../database/user_model');
const Diary = require('../database/diary_model');

// GET /diary - Retrieve all public diary entries
router.get('/', function (req, res, next) {
  Diary.find({ public: true }, function (err, diaries) {
    if (err) return console.error(err);
    res.status(200).json({ status: true, result: diaries });
  })
});

// POST /diary - Retrieve all entries belonging to an authenticated user
router.post('/', [check('token').exists()], function (req, res, next) {
  const { token } = req.body;

  // Validate the token and retrieve the private diary entries.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(200).json({
      status: false,
      error: 'Invalid authentication token.',
    });
  }

  User.findOne({ token: req.body.token }, function (err, user) {
    if (user) {
      Diary.find({ author: user.username }, function (err, diaries) {
        if (err) return console.error(err);
        res.status(200).json({ status: true, result: diaries });
      })
    } else {
      return res.status(200).json({
        status: false,
        error: 'Invalid authentication token.',
      });
    }
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
  function (req, res, next) {
    // `public` is reserved word in strict mode. Access using `isPublic` instead.
    const { token, title, text, public: isPublic } = req.body;

    // Validate the form values.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error('Validation failed.');
    }

    // Validate the token.
    User.findOne({ token: req.body.token }, function (err, user) {
      if (user) {
        // Add a new diary entry to the database afterwards.
        //const id = 2

        //Should do better code for auto incr.
        Diary.count(function(err, id) {
          var diary = new Diary({
            'id': id + 1, //count starts from 0
            title: req.body.title,
            author: user.username,
            publish_date: Date.now(),
            public: req.body.public,
            text: req.body.text
          });
  
          diary.save(function (err) {
            if (err) { console.log(err.stack); return; }
            res.status(201).json({
              status: true,
              result: id
            });
          });
        });
      } else {
        return res.status(200).json({
          status: false,
          error: 'Invalid authentication token.',
        });
      }
    });
  });

// POST /diary/delete - Delete an existing diary entry
router.post(
  '/delete',
  [
    check('token').exists(),
    check('id')
      .isInt()
      .toInt(),
  ],
  function (req, res, next) {
    const { token, id } = req.body;

    // Validate the form values.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error('Validation failed.');
    }

    //!!!need change permission

    // Validate the token.
    User.findOne({ token: req.body.token }, function (err, user) {
      if (user) {
        Diary.deleteOne({ id: req.body.id }, function (err) {
          if (err) return console.error(err);
          return res.status(200).json({
            status: true
          });
        });
      } else {
        return res.status(200).json({
          status: false,
          error: 'Invalid authentication token.',
        });
      }
    });

    // Validate that the diary entry exists and the user has permissions to delete the entry.
    // After that purge the entry from the database.
    // TODO: Replace this stub method.

    // if (id !== 2) {
    //   return res.status(200).json({
    //     status: false,
    //     error: 'You are not allowed to perform this action.',
    //   });
    // }

    // res.status(200).json({ status: true });
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
  function (req, res, next) {
    const { token, id, public: isPublic } = req.body;

    // Validate the form values.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error('Validation failed.');
    }

    // Validate token.
    User.findOne({ token: req.body.token }, function (err, user) {
      if (user) {
        //Todo extra validation
        Diary.findOne({ id: req.body.id }, function (err, diary) {
          if (err) { console.error(err); return; }

          if (diary) {
            diary.public = req.body.public
            diary.save()

            return res.status(200).json({
              status: true
            });
          }
        });
      } else {
        return res.status(200).json({
          status: false,
          error: 'Invalid authentication token.',
        });
      }
    });

    //TODO
    // Validate that the diary entry exists and the user has permissions to delete the entry.
    // After that modify the permissions of the diary entry.
    // TODO: Replace this stub method.
    // if (id !== 2) {
    //   return res.status(200).json({
    //     status: false,
    //     error: 'You are not allowed to perform this action.',
    //   });
    // }

    // res.status(200).json({ status: true });
  }
);

module.exports = router;
