const express = require('express');
const {
  borrowBook,
  returnBook,
  getBorrowings,
} = require('../controllers/borrowig.controllers');
const requireLogin = require('../middleware/requireLogin');

const bookingRouter = express.Router();

bookingRouter.patch('/borrow', requireLogin, borrowBook);

bookingRouter.patch('/return/:bid/:uid', requireLogin, returnBook);

bookingRouter.get('/:bookId', requireLogin, getBorrowings);

module.exports = bookingRouter;
