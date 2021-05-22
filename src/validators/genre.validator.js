const { body } = require('express-validator');

const validateGenre = [
  body('name')
    .trim()
    .isLength({
      min: 2,
      max: 150,
    })
    .withMessage(
      'Genre name cannot be shorter than 2 and longer than 150 characters'
    ),
];

module.exports = validateGenre;
