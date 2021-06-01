const express = require('express');
const {
  createAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
} = require('../controllers/author.controllers');
const requireLogin = require('../middleware/requireLogin');
const validateAuthor = require('../validators/author.validator');

const authorRouter = express.Router();

authorRouter.get('/', requireLogin, getAuthors);

authorRouter.post('/', requireLogin, validateAuthor, createAuthor);

authorRouter.put('/:aid', requireLogin, validateAuthor, updateAuthor);

authorRouter.delete('/:aid', requireLogin, deleteAuthor);

module.exports = authorRouter;
