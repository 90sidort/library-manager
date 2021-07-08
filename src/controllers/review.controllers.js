const { validationResult } = require('express-validator');
const Review = require('../models/review.model');
const HttpError = require('../utils/error');
const createErrorMessage = require('../utils/errorMessage');

const getReview = async (req, res, next) => {
  const { page = 1, limit = 25 } = req.query;
  try {
    const query = {};
    const { user, book, id, reported } = req.query;
    if (reported) query.reported = true;
    if (user) query.user = { _id: user };
    else if (book) query.book = { _id: book };
    // eslint-disable-next-line no-underscore-dangle
    else if (id) query._id = id;
    const review = await Review.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('book', 'title')
      .populate('user', 'name surname')
      .sort({ updatedAt: 'desc' })
      .exec();
    const count = await Review.find(query).countDocuments();
    if (!review) return next(new HttpError('No reviews', 422));
    return res.status(200).json({ count, currentPage: page, review });
  } catch (err) {
    return next(new HttpError('Server error.', 500));
  }
};

const createReview = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    const errorMessage = await createErrorMessage(errors);
    return next(new HttpError(errorMessage, 422));
  }
  try {
    const { title, review, rating, user, book } = await req.body;
    const checkReview = await Review.find({ user, book });
    if (checkReview && checkReview.length > 0)
      return next(
        new HttpError('You have already created review for this book', 422)
      );
    const newReview = await new Review({
      title,
      review,
      rating,
      user,
      book,
    }).save();
    return res.status(201).json({ review: newReview });
  } catch (err) {
    return next(new HttpError('Server error.', 500));
  }
};

const updateReview = async (req, res, next) => {
  const { rid } = req.params;
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    const errorMessage = await createErrorMessage(errors);
    return next(new HttpError(errorMessage, 422));
  }
  try {
    const { title, review, rating, reported } = await req.body;
    const checkReview = await Review.findById(rid);
    if (!checkReview)
      return next(new HttpError('This review does not exist', 404));
    if (!req.query.admin) {
      if (req.query.userId !== checkReview.user.toString()) {
        if (req.method !== 'PATCH')
          return next(new HttpError('Unauthorized.', 403));
      }
    }
    checkReview.reported =
      typeof reported === 'boolean' ? reported : checkReview.reported;
    checkReview.title = title || checkReview.title;
    checkReview.review = review || checkReview.review;
    checkReview.rating = rating || checkReview.rating;
    checkReview.save();
    return res.status(200).json({ review: checkReview });
  } catch (err) {
    return next(new HttpError('Server error.', 500));
  }
};

const deleteReview = async (req, res, next) => {
  const { rid } = req.params;
  try {
    const checkReview = await Review.findById(rid);
    if (!checkReview)
      return next(new HttpError('This review does not exist', 404));
    if (!req.query.admin) {
      if (req.query.userId !== checkReview.user.toString())
        return next(new HttpError('Unauthorized.', 403));
    }
    checkReview.remove();
    return res.status(200).json({ review: checkReview });
  } catch (err) {
    return next(new HttpError('Server error.', 500));
  }
};

module.exports = { getReview, createReview, updateReview, deleteReview };
