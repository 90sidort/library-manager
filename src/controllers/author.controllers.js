const { validationResult } = require('express-validator');
const Author = require('../models/author.model');
const Book = require('../models/book.model');
const HttpError = require('../utils/error');
const createErrorMessage = require('../utils/errorMessage');

const getAuthors = async (req, res, next) => {
  const { aid, name, surname, country, page = 1, limit = 25 } = req.query;
  const query = {};
  try {
    // eslint-disable-next-line no-underscore-dangle
    if (aid) query._id = aid;
    if (name) query.name = { $regex: `${name}`, $options: 'i' };
    if (surname) query.surname = { $regex: `${surname}`, $options: 'i' };
    if (country && country !== 'all') query.country = { _id: country };
    const author = await Author.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('country', 'name')
      .sort({ updatedAt: 'desc' })
      .exec();
    const count = await Author.find(query).countDocuments();
    return res.status(200).json({ count, currentPage: page, author });
  } catch (err) {
    return next(new HttpError('Server error.', 500));
  }
};

const createAuthor = async (req, res, next) => {
  if (!req.query.admin) return next(new HttpError('Unauthorized.', 403));
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    const errorMessage = await createErrorMessage(errors);
    return next(new HttpError(errorMessage, 422));
  }
  try {
    const { name, surname, country, description } = await req.body;
    const author = await new Author({
      name,
      surname,
      country,
      description,
    }).save();
    return res.status(201).json({ author });
  } catch (err) {
    return next(new HttpError('Server error!', 500));
  }
};

const updateAuthor = async (req, res, next) => {
  if (!req.query.admin) return next(new HttpError('Unauthorized.', 403));
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    const errorMessage = await createErrorMessage(errors);
    return next(new HttpError(errorMessage, 422));
  }
  try {
    const { name, surname, country, description } = await req.body;
    const author = await Author.findById(req.params.aid);
    if (!author) {
      return next(new HttpError('Author does not exists.', 403));
    }
    author.name = name || author.name;
    author.surname = surname || author.surname;
    author.country = country || author.country;
    author.description = description || author.description;
    author.save();
    return res.status(200).json({ author });
  } catch (err) {
    return next(new HttpError('Server error.', 500));
  }
};

const deleteAuthor = async (req, res, next) => {
  if (!req.query.admin) return next(new HttpError('Unauthorized.', 403));
  try {
    const author = await Author.findById(req.params.aid);
    if (!author) return next(new HttpError('Author not found!', 422));
    const books = await Book.find({ authors: author._id });
    if (books.length > 0)
      return next(new HttpError('Author has books, cannot be deleted!', 403));
    await author.remove();
    return res.status(200).json({ author });
  } catch (err) {
    return next(new HttpError('Server error!', 500));
  }
};

module.exports = { createAuthor, getAuthors, updateAuthor, deleteAuthor };
