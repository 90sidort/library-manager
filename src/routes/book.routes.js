const express = require('express');
const { createBook, getBooks } = require('../controllers/book.controllers');
const validateBook = require('../validators/book.validator');

const bookRouter = express.Router();

bookRouter.get('/', getBooks);

bookRouter.post('/', validateBook, createBook);

module.exports = bookRouter;
