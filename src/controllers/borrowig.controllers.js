/* eslint-disable no-underscore-dangle */
const { startSession } = require('mongoose');
const Book = require('../models/book.model');
const User = require('../models/user.model');
const HttpError = require('../utils/error');

const borrowBook = async (req, res, next) => {
  if (!req.query.admin) return next(new HttpError('Unauthorized.', 403));
  const { bid, email } = await req.body;
  try {
    const book = await Book.findById(bid);
    const user = await User.findOne({ email });
    if (!book) return next(new HttpError('Book not found', 404));
    if (!user) return next(new HttpError('User not found', 404));
    if (!book.available) return next(new HttpError('Book not available', 400));
    if (user.borrowed.length > 3)
      return next(
        new HttpError('User already has reached borrowing limit!', 400)
      );
    const session = await startSession();
    session.startTransaction();
    const startDate = new Date();
    const end = new Date();
    const endDate = new Date(end.setDate(end.getDate() + 14));
    book.available = false;
    book.borrower = user._id;
    await book.save({ session });
    user.borrowed.push({ book: book._id, start: startDate, end: endDate });
    await user.save({ session });
    await session.commitTransaction();
    return res.status(200).json({ book });
  } catch (err) {
    return next(new HttpError('Server error.', 500));
  }
};

const getBorrowings = async (req, res, next) => {
  const { bookId } = await req.params;
  try {
    const borrowing = await User.findOne({ 'borrowed.book': bookId });
    return res.status(200).json({ borrowed: borrowing.borrowed });
  } catch (err) {
    return next(new HttpError('Server error.', 500));
  }
};

const returnBook = async (req, res, next) => {
  if (!req.query.admin) return next(new HttpError('Unauthorized.', 403));
  const { bid, uid } = await req.body;
  try {
    const book = await Book.findById(bid);
    const user = await User.findById(uid);
    if (!book) return next(new HttpError('Book not found', 404));
    if (!user) return next(new HttpError('User not found', 404));
    if (book.borrower.toString() !== uid)
      return next(new HttpError('Book is not borrowed by user', 400));
    const session = await startSession();
    session.startTransaction();
    book.available = true;
    book.borrower = null;
    await book.save({ session });
    const newBorrows = await user.borrowed.filter(
      (bookObj) => bookObj.book.toString() !== bid
    );
    user.borrowed = newBorrows;
    await user.save({ session });
    await session.commitTransaction();
    return res.status(200).json({ user });
  } catch (err) {
    return next(new HttpError('Server error.', 500));
  }
};

module.exports = { borrowBook, returnBook, getBorrowings };
