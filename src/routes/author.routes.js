const express = require('express');
const {
  createAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
} = require('../controllers/author.controllers');
const validateAuthor = require('../validators/author.validator');

const authorRouter = express.Router();

authorRouter.get('/', getAuthors);

authorRouter.post('/', validateAuthor, createAuthor);

authorRouter.put('/:aid', validateAuthor, updateAuthor);

authorRouter.delete('/:aid', deleteAuthor);

module.exports = authorRouter;
