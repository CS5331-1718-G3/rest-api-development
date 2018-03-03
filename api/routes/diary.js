'use strict';

const express = require('express');
const { celebrate, Joi } = require('celebrate');
const router = express.Router({ mergeParams: true });

const User = require('../database/user_model');
const Diary = require('../database/diary_model');

// GET /diary - Retrieve all public diary entries
router.get('/', async function(req, res, next) {
  // Return all public diary entries most recent first.
  const diaries = await Diary.find({ public: true }, { _id: 0 }).sort({
    publish_date: -1,
  });

  res.status(200).json(diaries);
});

// POST /diary - Retrieve all entries belonging to an authenticated user
router.post(
  '/',
  celebrate({
    body: {
      token: Joi.string().required(),
    },
  }),
  async function(req, res, next) {
    const { token } = req.body;

    // Find a user who has a matching token.
    const user = await User.findOne({ token });
    if (!user) {
      return next(new Error('Invalid authentication token.'));
    }

    // Return the user's diaries.
    const diaries = await Diary.find({ author: user.username }, { _id: 0 });
    res.status(200).json(diaries);
  }
);

// POST /diary/create - Create a new diary entry
router.post(
  '/create',
  celebrate({
    body: {
      token: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      public: Joi.bool().required(),
    },
  }),
  async function(req, res, next) {
    // `public` is reserved word in strict mode. Access using `isPublic` instead.
    const { token, title, text, public: isPublic } = req.body;

    // Validate the token.
    const user = await User.findOne({ token: token });
    if (!user) {
      return next(new Error('Invalid authentication token.'));
    }

    // Save new diary entry.
    const diary = new Diary({
      title,
      author: user.username,
      publish_date: new Date(),
      public: isPublic,
      text,
    });

    const doc = await diary.save();

    res.status(201).json({ id: doc.id });
  }
);

// POST /diary/delete - Delete an existing diary entry
router.post(
  '/delete',
  celebrate({
    body: {
      token: Joi.string().required(),
      id: Joi.number().integer().required(),
    },
  }),
  async function(req, res, next) {
    const { token, id } = req.body;

    // Validate the token.
    const user = await User.findOne({ token });
    if (!user) {
      return next(new Error('Invalid authentication token.'));
    }

    // Verify if the diary entry belongs to the user.
    const diary = await Diary.findOne({ id });
    if (!diary) {
      return next(new Error('Invalid diary ID.'));
    }

    if (diary.author !== user.username) {
      return next(new Error('You are not allowed to perform this action.'));
    }

    // Delete the diary entry.
    await Diary.deleteOne({ id });

    res.status(200).json();
  }
);

// POST /diary/permission - Adjust diary entry permissions
router.post(
  '/permission',
  celebrate({
    body: {
      token: Joi.string().required(),
      id: Joi.number().integer().required(),
      public: Joi.bool().required(),
    },
  }),
  async function(req, res, next) {
    const { token, id, public: isPublic } = req.body;

    // Validate token.
    const user = await User.findOne({ token });
    if (!user) {
      return next(new Error('Invalid authentication token.'));
    }

    // Verify that the user has permissions to modify the entry.
    const diary = await Diary.findOne({ id });
    if (!diary) {
      return next(new Error('Invalid diary ID.'));
    }

    if (diary.author !== user.username) {
      return next(new Error('You are not allowed to perform this action.'));
    }

    // Update the diary entry's permissions.
    diary.public = isPublic;
    diary.save();

    res.status(200).json();
  }
);

module.exports = router;
