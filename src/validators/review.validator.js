const { body } = require('express-validator');

const validateReview = [
  body('title')
    .trim()
    .isLength({
      min: 2,
      max: 700,
    })
    .withMessage('Title requires at least 2 chars and max 700 chars.'),
  body('review')
    .trim()
    .optional()
    .isLength({
      max: 2000,
    })
    .withMessage('Review requires at least 1 char and max 2000 chars.'),
  body('rating')
    .isInt({
      min: 1,
      max: 6,
    })
    .withMessage('Rating must be a number between 1 and 6.'),
  body('user').isMongoId().withMessage('User must be a valid mongo id.'),
  body('book').isMongoId().withMessage('Book must be a valid mongo id.'),
];

const validateUpdateReview = [
  body('title')
    .trim()
    .isLength({
      min: 2,
      max: 700,
    })
    .withMessage('Title requires at least 2 chars and max 700 chars.'),
  body('review')
    .trim()
    .optional()
    .isLength({
      max: 2000,
    })
    .withMessage('Review requires at least 1 char and max 2000 chars.'),
  body('rating')
    .isInt({
      min: 1,
      max: 6,
    })
    .withMessage('Rating must be a number between 1 and 6.'),
];

module.exports = { validateReview, validateUpdateReview };
