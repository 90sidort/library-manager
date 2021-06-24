const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const HttpError = require('../utils/error');
const createErrorMessage = require('../utils/errorMessage');
const Admin = require('../models/admin.model');

const getUsers = async (req, res, next) => {
  if (!req.query.admin) {
    if (req.query.userId !== req.query.uid)
      return next(new HttpError('Unauthorized.', 403));
  }
  const { page = 1, limit = 25 } = req.query;
  const query = {};
  try {
    // eslint-disable-next-line no-underscore-dangle
    if (req.query.uid) query._id = req.query.uid;
    if (req.query.name)
      query.name = { $regex: `${req.query.name}`, $options: 'i' };
    if (req.query.surname)
      query.surname = { $regex: `${req.query.surname}`, $options: 'i' };
    if (req.query.email)
      query.email = { $regex: `${req.query.email}`, $options: 'i' };
    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('borrowed.book', 'title authors published')
      .select('-password');
    const count = await User.find(query).countDocuments();
    if (users.length < 1) return next(new HttpError('User not found.', 404));
    return res.status(200).json({ count, currentPage: page, users });
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
    user.password = '';
    return res.status(201).json({ user });
  } catch (err) {
    return next(new HttpError('Server error!', 500));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(new HttpError('User does not exists.', 403));
    }
    if (existingUser.archived === true) {
      return next(new HttpError('This account has been archived.', 403));
    }
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) return next(new HttpError('Incorrect password!'));
    const admin = await Admin.findOne({ admin: existingUser._id });
    const token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        admin: admin ? true : false,
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );
    return res.status(200).json({
      userId: existingUser.id,
      email: existingUser.email,
      token,
      userName: existingUser.name,
      admin: admin ? true : false,
    });
  } catch (err) {
    return next(new HttpError('Login failed.', 500));
  }
};

const updateUser = async (req, res, next) => {
  if (!req.query.admin) {
    if (req.query.userId !== req.query.uid)
      return next(new HttpError('Unauthorized.', 403));
  }
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    const errorMessage = await createErrorMessage(errors);
    return next(new HttpError(errorMessage, 422));
  }
  try {
    const { name, surname, about, email, newPassword } = await req.body;
    const user = await User.findById(req.params.uid).populate(
      'borrowed.book',
      'title'
    );
    if (!user) {
      return next(new HttpError('User does not exists.', 403));
    }

    if (email !== user.email) {
      const checkEmail = await User.findOne({ email: email });
      if (checkEmail)
        return next(new HttpError('This email is already taken.', 400));
      user.email = email;
    }
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
    }
    user.name = name || user.name;
    user.surname = surname || user.surname;
    user.about = about || user.about;
    await user.save();
    user.password = '';
    return res.status(200).json({ user });
  } catch (err) {
    return next(new HttpError('Server error.', 500));
  }
};

const archiveUser = async (req, res, next) => {
  if (!req.query.admin) {
    return next(new HttpError('Unauthorized.', 403));
  }
  const { archived } = await req.body;
  try {
    const user = await User.findById(req.params.uid);
    if (!user) return next(new HttpError('User not found!', 422));
    if (!user.archived && archived) {
      if (user.borrowed.length > 0)
        return next(
          new HttpError(
            'User cannot be archived due to having unreturned books!',
            403
          )
        );
      user.archived = true;
    } else if (user.archived && !archived) {
      user.archived = false;
    } else {
      return next(new HttpError('Invalid action', 400));
    }
    await user.save();
    user.password = '';
    return res.status(200).json({ user });
  } catch (err) {
    return next(new HttpError('Server error.', 500));
  }
};

const deleteUser = async (req, res, next) => {
  if (!req.query.admin) {
    return next(new HttpError('Unauthorized.', 403));
  }
  try {
    const user = await User.findById(req.params.uid);
    if (!user) return next(new HttpError('User not found!', 422));
    if (user.borrowed.length > 0)
      return next(
        new HttpError(
          'User cannot be deleted due to having unreturned books!',
          403
        )
      );
    await user.remove();
    user.password = '';
    return res.status(200).json({ user });
  } catch (err) {
    return next(new HttpError('Server error!', 500));
  }
};

const addAdmin = async (req, res, next) => {
  if (!req.query.admin) {
    return next(new HttpError('Unauthorized.', 403));
  }
  const { uid } = await req.params;
  try {
    const user = await User.findById(uid);
    if (!user) return next(new HttpError('User does not exist!', 404));
    await new Admin({ admin: user._id }).save();
    return res.status(200).json({ done: true });
  } catch (err) {
    return next(new HttpError('Server error!', 500));
  }
};

module.exports = {
  getUsers,
  signup,
  login,
  updateUser,
  deleteUser,
  archiveUser,
  addAdmin,
};
