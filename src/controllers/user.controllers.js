const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../models/user.model');
const HttpError = require('../utils/error');
const createErrorMessage = require('../utils/errorMessage');

const getUsers = async (req, res, next) => {
  const query = {};
  try {
    // eslint-disable-next-line no-underscore-dangle
    if (req.query.uid) query._id = req.query.uid;
    else if (req.query.name)
      query.name = { $regex: `${req.query.name}`, $options: 'i' };
    else if (req.query.surname)
      query.surname = { $regex: `${req.query.surname}`, $options: 'i' };
    else if (req.query.email)
      query.email = { $regex: `${req.query.email}`, $options: 'i' };
    const users = await User.find(query);
    return res.status(200).json({ users });
  } catch (err) {
    return next(new HttpError('Server error.', 500));
  }
};

const signup = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    const errorMessage = await createErrorMessage(errors);
    return next(new HttpError(errorMessage, 422));
  }
  try {
    const { name, surname, email, password, about } = await req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return next(
        new HttpError(`User with email ${email} already exists!`, 400)
      );
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await new User({
      name,
      surname,
      email,
      password: hashedPassword,
      about,
    }).save();
    return res.status(201).json({ user });
  } catch (err) {
    return next(new HttpError('Server error!', 500));
  }
};

const login = async (req, res, next) => {};

// const updateCountry = async (req, res, next) => {
//   const { errors } = validationResult(req);
//   if (errors.length > 0) {
//     const errorMessage = await createErrorMessage(errors);
//     return next(new HttpError(errorMessage, 422));
//   }
//   try {
//     const country = await Country.findById(req.params.cid);
//     if (!country) return next(new HttpError('Genre not found!', 422));
//     const { name } = await req.body;
//     country.name = name;
//     await country.save();
//     return res.status(200).json({ country });
//   } catch (err) {
//     return next(new HttpError('Server error!', 500));
//   }
// };

// const deleteCountry = async (req, res, next) => {
//   try {
//     const country = await Country.findById(req.params.cid);
//     if (!country) return next(new HttpError('Genre not found!', 422));
//     await country.remove();
//     return res.status(200).json({ country });
//   } catch (err) {
//     return next(new HttpError('Server error!', 500));
//   }
// };

module.exports = {
  getUsers,
  signup,
  login,
};
