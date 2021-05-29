/* eslint-disable no-underscore-dangle */
const { startSession } = require('mongoose');
const Book = require('../models/book.model');
const User = require('../models/user.model');
const HttpError = require('../utils/error');

const borrowBook = async (req, res, next) => {
  const { bid, uid } = await req.params;
  try {
    const book = await Book.findById(bid);
    const user = await User.findById(uid);
    if (!book) return next(new HttpError('Book not found', 404));
    if (!user) return next(new HttpError('User not found', 404));
    if (!book.available) return next(new HttpError('Book not available', 400));
    if (user.borrowed.length > 3)
      return next(
        new HttpError('User already has reached borrowing limit!', 400)
      );
    const session = await startSession();
    session.startTransaction();
    book.available = false;
    book.borrower = user._id;
    await book.save({ session });
    user.borrowed.push(book._id);
    await user.save({ session });
    await session.commitTransaction();
    return res.status(200).json({ book, user });
  } catch (err) {
    console.log(err);
    return next(new HttpError('Server error.', 500));
  }
};

const returnBook = async (req, res, next) => {
  const { bid, uid } = await req.params;
  try {
    const book = await Book.findById(bid);
    const user = await User.findById(uid);
    if (!book) return next(new HttpError('Book not found', 404));
    if (!user) return next(new HttpError('User not found', 404));
    if (book.borrower.toString() !== uid)
      return next(new HttpError('Book is not borrowed by user', 400));
    if (!user.borrowed.includes(bid))
      return next(new HttpError('User did not borrow this book!', 400));
    const session = await startSession();
    session.startTransaction();
    book.available = true;
    book.borrower = null;
    await book.save({ session });
    const newBorrows = await user.borrowed.filter(
      (bookId) => bookId.toString() !== bid
    );
    user.borrowed = newBorrows;
    await user.save({ session });
    await session.commitTransaction();
    return res.status(200).json({ book, user });
  } catch (err) {
    console.log(err);
    return next(new HttpError('Server error.', 500));
  }
};

module.exports = { borrowBook, returnBook };
