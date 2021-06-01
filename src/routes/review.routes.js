const express = require('express');
const {
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/review.controllers');
const {
  validateReview,
  validateUpdateReview,
} = require('../validators/review.validator');
const requireLogin = require('../middleware/requireLogin');

const reviewRouter = express.Router();

reviewRouter.get('/', requireLogin, getReview);

reviewRouter.post('/', requireLogin, validateReview, createReview);

reviewRouter.put('/:rid', requireLogin, validateUpdateReview, updateReview);

reviewRouter.delete('/:rid', requireLogin, deleteReview);

module.exports = reviewRouter;
