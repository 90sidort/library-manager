const { body } = require('express-validator');

const validateAuthor = [
  body('name')
    .trim()
    .isLength({
      min: 2,
      max: 700,
    })
    .withMessage('Author name requires at least 2 chars and max 700 chars.'),
  body('surname')
    .trim()
    .isLength({
      min: 2,
      max: 700,
    })
    .withMessage('Author surname requires at least 2 chars and max 700 chars.'),
  body('description')
    .trim()
    .optional()
    .isLength({
      max: 2000,
    })
    .withMessage('Author description must have at most 2000 chars.'),
  body('country').isMongoId().withMessage('Country must be a valid mongo id.'),
];

module.exports = validateAuthor;
