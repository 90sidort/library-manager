const { validationResult } = require('express-validator');
const Book = require('../models/book.model');
const HttpError = require('../utils/error');
const createErrorMessage = require('../utils/errorMessage');

const getBooks = async (req, res, next) => {
  const {
    bid,
    title,
    pagesMin,
    pagesMax,
    publishedMin,
    publishedMax,
    genre,
    language,
    publisher,
    available,
    author,
  } = req.query;
  let query = {};
  try {
    if (bid) query = { _id: bid };
    if (title) query.title = { $regex: `${title}`, $options: 'i' };
    if (pagesMin && pagesMax) query.pages = { $gt: pagesMin, $lt: pagesMax };
    if (pagesMin && !pagesMax) query.pages = { $gt: pagesMin, $lt: 10000 };
    if (!pagesMin && pagesMax) query.pages = { $gt: 1, $lt: pagesMax };
    if (publishedMin && publishedMax)
      query.published = {
        $gt: publishedMin - 1,
        $lt: publishedMax,
      };
    if (publishedMin && !publishedMax)
      query.published = { $gt: publishedMin - 1, $lt: 3000 };
    if (!publishedMin && publishedMax)
      query.published = { $gt: 1900, $lt: publishedMax };
    if (genre) query.genre = { _id: genre };
    if (language) query.language = { language };
    if (publisher) query.publisher = { publisher };
    if (available) query.available = { available };
    if (author) query.authors = { _id: author };
    const books = await Book.find(query)
      .populate('authors', 'name surname')
      .populate('genre', 'name')
      .populate('borrower', 'name surname')
      .exec();
    return res.status(200).json({ books });
  } catch (err) {
    return next(new HttpError('Server error.', 500));
  }
};

const createBook = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    const errorMessage = await createErrorMessage(errors);
    return next(new HttpError(errorMessage, 422));
  }
  try {
    const {
      title,
      pages,
      published,
      genre,
      language,
      publisher,
      available,
      authors,
      description,
    } = await req.body;
    const book = await new Book({
      title,
      pages,
      published,
      genre,
      language,
      publisher,
      available,
      authors,
      description,
    }).save();
    return res.status(201).json({ book });
  } catch (err) {
    return next(new HttpError('Server error!', 500));
  }
};

const updateBook = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    const errorMessage = await createErrorMessage(errors);
    return next(new HttpError(errorMessage, 422));
  }
  try {
    const book = await Book.findById(req.params.bid);
    if (!book) return next(new HttpError('Book not found!', 422));
    const {
      title,
      pages,
      published,
      language,
      publisher,
      available,
      description,
      authorsAdd,
      authorsDelete,
      genreAdd,
      genreDelete,
    } = await req.body;
    book.title = title || book.title;
    book.pages = pages || book.pages;
    book.published = published || book.published;
    book.language = language || book.language;
    book.publisher = publisher || book.publisher;
    book.available = available || book.available;
    book.description = description || book.description;
    if (authorsDelete && authorsDelete.length > 0) {
      let index;
      authorsDelete.forEach((author) => {
        index = book.authors.indexOf(author);
        book.authors.splice(index, 1);
      });
    }
    if (authorsAdd && authorsAdd.length > 0) {
      authorsAdd.forEach((author) => {
        book.authors.push(author);
      });
    }
    if (genreDelete && genreDelete.length > 0) {
      let index;
      genreDelete.forEach((genre) => {
        index = book.genre.indexOf(genre);
        book.genre.splice(index, 1);
      });
    }
    if (genreAdd && genreAdd.length > 0) {
      genreAdd.forEach((genre) => {
        if (book.genre.length < 4) {
          book.genre.push(genre);
        }
      });
    }
    await book.save();
    return res.status(201).json({ book });
  } catch (err) {
    console.log(err);
    return next(new HttpError('Server error!', 500));
  }
};

const deleteBoook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bid);
    if (!book) return next(new HttpError('Book not found!', 422));
    if (book.borrower)
      return next(
        new HttpError('Book is borrowed and cannot be deleted!', 422)
      );
    await book.remove();
    return res.status(200).json({ book });
  } catch (err) {
    console.log(err);
    return next(new HttpError('Server error!', 500));
  }
};

module.exports = { getBooks, createBook, updateBook, deleteBoook };
