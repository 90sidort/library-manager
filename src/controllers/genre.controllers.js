const { validationResult } = require('express-validator');
const Genre = require('../models/genre.model');
const HttpError = require('../utils/error');
const createErrorMessage = require('../utils/errorMessage');

const getGenres = async (req, res, next) => {
  try {
    const genres = await Genre.find();
    return res.status(200).json({ genres });
  } catch (err) {
    return next(new HttpError('Server error.', 500));
  }
};

const createGenre = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    const errorMessage = await createErrorMessage(errors);
    return next(new HttpError(errorMessage, 422));
  }
  try {
    const { name } = await req.body;
    const genre = await new Genre({ name }).save();
    return res.status(201).json({ genre });
  } catch (err) {
    return next(new HttpError('Server error!', 500));
  }
};

const updateGenre = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    const errorMessage = await createErrorMessage(errors);
    return next(new HttpError(errorMessage, 422));
  }
  try {
    const genre = await Genre.findById(req.params.id);
  } catch (err) {}
};

const deleteGenre = async (req, res, next) => {};

module.exports = {
  getGenres,
  createGenre,
};
