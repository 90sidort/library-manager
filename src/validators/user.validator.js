const { body } = require('express-validator');

const validateUser = [
  body('name')
    .trim()
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage('User name requires at least 3 chars and max 100 chars'),
  body('surname')
    .trim()
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage('User surname requires at least 3 chars and max 100 chars'),
  body('email')
    .trim()
    .isEmail()
    .isLength({
      min: 1,
      max: 100,
    })
    .withMessage('Requires valid email'),
  body('about')
    .trim()
    .isLength({
      max: 1000,
    })
    .withMessage('1000 chars max!'),
  body('password')
    .trim()
    .isLength({
      min: 6,
      max: 16,
    })
    .withMessage('Requires at least 6 chars and max 16 chars'),
];

module.exports = { validateUser };
