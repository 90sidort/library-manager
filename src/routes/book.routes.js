const express = require('express');
const {
  createBook,
  getBooks,
  updateBook,
  deleteBoook,
} = require('../controllers/book.controllers');
const requireLogin = require('../middleware/requireLogin');
const validateBook = require('../validators/book.validator');

const bookRouter = express.Router();

bookRouter.get('/', requireLogin, getBooks);

bookRouter.post('/', requireLogin, validateBook, createBook);

bookRouter.put('/:bid', requireLogin, validateBook, updateBook);

bookRouter.delete('/:bid', requireLogin, deleteBoook);

module.exports = bookRouter;
