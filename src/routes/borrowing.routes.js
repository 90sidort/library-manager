const express = require('express');
const {
  borrowBook,
  returnBook,
  getBorrowings,
} = require('../controllers/borrowig.controllers');

const bookingRouter = express.Router();

bookingRouter.patch('/:bid/:uid', borrowBook);

bookingRouter.patch('/return/:bid/:uid', returnBook);

bookingRouter.get('/:bookId', getBorrowings);

module.exports = bookingRouter;
