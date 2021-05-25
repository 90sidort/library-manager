const express = require('express');
const {
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/review.controllers');
const validateReview = require('../validators/review.validator');

const reviewRouter = express.Router();

reviewRouter.get('/', getReview);

reviewRouter.post('/', validateReview, createReview);

reviewRouter.put('/:rid', validateReview, updateReview);

reviewRouter.delete('/:rid', deleteReview);

module.exports = reviewRouter;
