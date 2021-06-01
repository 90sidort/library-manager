const { validationResult } = require('express-validator');
const Country = require('../models/country.model');
const HttpError = require('../utils/error');
const createErrorMessage = require('../utils/errorMessage');

const getCountries = async (req, res, next) => {
  if (!req.query.admin) return next(new HttpError('Unauthorized.', 403));
  const { page = 1, limit = 25 } = req.query;
  let query = {};
  try {
    if (req.query.cid) query = { _id: req.query.cid };
    else if (req.query.name)
      query = { name: { $regex: `${req.query.name}`, $options: 'i' } };
    const countries = await Country.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Country.countDocuments();
    return res
      .status(200)
      .json({ total: Math.ceil(count / limit), currentPage: page, countries });
  } catch (err) {
    return next(new HttpError('Server error.', 500));
  }
};

const createCountry = async (req, res, next) => {
  if (!req.query.admin) return next(new HttpError('Unauthorized.', 403));
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    const errorMessage = await createErrorMessage(errors);
    return next(new HttpError(errorMessage, 422));
  }
  try {
    const { name } = await req.body;
    const country = await new Country({ name }).save();
    return res.status(201).json({ country });
  } catch (err) {
    return next(new HttpError('Server error!', 500));
  }
};

const updateCountry = async (req, res, next) => {
  if (!req.query.admin) return next(new HttpError('Unauthorized.', 403));
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    const errorMessage = await createErrorMessage(errors);
    return next(new HttpError(errorMessage, 422));
  }
  try {
    const country = await Country.findById(req.params.cid);
    if (!country) return next(new HttpError('Country not found!', 422));
    const { name } = await req.body;
    country.name = name;
    await country.save();
    return res.status(200).json({ country });
  } catch (err) {
    return next(new HttpError('Server error!', 500));
  }
};

const deleteCountry = async (req, res, next) => {
  if (!req.query.admin) return next(new HttpError('Unauthorized.', 403));
  try {
    const country = await Country.findById(req.params.cid);
    if (!country) return next(new HttpError('Genre not found!', 422));
    await country.remove();
    return res.status(200).json({ country });
  } catch (err) {
    return next(new HttpError('Server error!', 500));
  }
};

module.exports = {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
};
