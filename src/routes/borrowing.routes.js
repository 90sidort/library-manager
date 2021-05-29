const express = require('express');
const {
  borrowBook,
  returnBook,
} = require('../controllers/borrowig.controllers');

const bookingRouter = express.Router();

bookingRouter.patch('/:bid/:uid', borrowBook);

bookingRouter.patch('/return/:bid/:uid', returnBook);

module.exports = bookingRouter;
