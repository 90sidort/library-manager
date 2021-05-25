const { validationResult } = require('express-validator');
const Review = require('../models/review.model');
const HttpError = require('../utils/error');
const createErrorMessage = require('../utils/errorMessage');

const getReview = async (req, res, next) => {
  try {
    let searchQuery = {};
    const { user, book, id } = req.query;
    if (user) searchQuery.user = { _id: user };
    else if (book) searchQuery.book = { _id: book };
    else if (id) searchQuery._id = id;
    const review = await Review.find(searchQuery);
    if (!review) return next(new HttpError('No reviews', 422));
    return res.status(201).json({ review });
  } catch (err) {}
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
    if (checkReview)
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
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    const errorMessage = await createErrorMessage(errors);
    return next(new HttpError(errorMessage, 422));
  }
  try {
    const { title, review, rating } = await req.body;
    const { rid } = req.query;
    const checkReview = await Review.findById(rid);
    if (!checkReview)
      return next(new HttpError('This review does not exist', 404));
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
  const { rid } = req.query;
  try {
    const checkReview = await Review.findById(rid);
    if (!checkReview)
      return next(new HttpError('This review does not exist', 404));
    checkReview.remove();
    return res.status(200).json({ review: checkReview });
  } catch (err) {
    return next(new HttpError('Server error.', 500));
  }
};

module.exports = { getReview, createReview, updateReview, deleteReview };
