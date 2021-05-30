const { validationResult } = require('express-validator');
const Genre = require('../models/genre.model');
const HttpError = require('../utils/error');
const createErrorMessage = require('../utils/errorMessage');

const getGenres = async (req, res, next) => {
  const { page = 1, limit = 25 } = req.query;
  let query = {};
  try {
    if (req.query.gid) query = { _id: req.query.gid };
    else if (req.query.name)
      query = { name: { $regex: `${req.query.name}`, $options: 'i' } };
    const genres = await Genre.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Genre.countDocuments();
    return res
      .status(200)
      .json({ total: Math.ceil(count / limit), currentPage: page, genres });
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
    const genre = await Genre.findById(req.params.gid);
    if (!genre) return next(new HttpError('Genre not found!', 422));
    const { name } = await req.body;
    genre.name = name;
    await genre.save();
    return res.status(200).json({ genre });
  } catch (err) {
    return next(new HttpError('Server error!', 500));
  }
};

const deleteGenre = async (req, res, next) => {
  try {
    const genre = await Genre.findById(req.params.gid);
    if (!genre) return next(new HttpError('Genre not found!', 422));
    await genre.remove();
    return res.status(200).json({ genre });
  } catch (err) {
    return next(new HttpError('Server error!', 500));
  }
};

module.exports = {
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
};
