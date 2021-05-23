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
        $gt: publishedMin,
        $lt: publishedMax,
      };
    if (publishedMin && !publishedMax)
      query.published = { $gt: publishedMin, $lt: 3000 };
    if (!publishedMin && publishedMax)
      query.published = { $gt: 1900, $lt: publishedMax };
    if (genre) query.genre = { genre };
    if (language) query.language = { language };
    if (publisher) query.publisher = { publisher };
    if (available) query.available = { available };
    if (author) query.author = { author };
    const books = await Book.find(query);
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

module.exports = { getBooks, createBook };
