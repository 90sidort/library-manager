const express = require('express');
const {
  createBook,
  getBooks,
  updateBook,
  deleteBoook,
} = require('../controllers/book.controllers');
const validateBook = require('../validators/book.validator');

const bookRouter = express.Router();

bookRouter.get('/', getBooks);

bookRouter.post('/', validateBook, createBook);

bookRouter.put('/:bid', validateBook, updateBook);

bookRouter.delete('/:bid', deleteBoook);

module.exports = bookRouter;
