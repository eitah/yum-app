/* eslint-disable new-cap, consistent-return, no-console */

import express from 'express';
const router = module.exports = express.Router();
import Bookmark from '../models/bookmark';
import joi from 'joi';

router.post('/', (req, res) => {
  const schema = {
    title: joi.string().required(),
    url: joi.string().uri().required(),
    description: joi.string(),
    isProtected: joi.boolean(),
    datePublished: joi.date().min('1995-01-01'),
    dateCreated: joi.date(),
    stars: joi.number().min(1).max(5),
    tags: joi.array().items(joi.string()).min(1),
  };

  const results = joi.validate(req.body, schema);

  console.log('results', results.ValidationError, results.value);

  if (results.error) {
    console.log('messages', results.error.details.map(d => d.message));
    return res.status(400).send({ messages: results.error.details.map(d => d.message) });
  }

  Bookmark.create(results.value, (err, bookmark) => {
    res.send({ err, bookmark });
  });
});
