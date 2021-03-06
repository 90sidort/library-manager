const { body } = require('express-validator');
const listOfLanguages = require('./../utils/languages.enum');

const validateBook = [
  body('title')
    .trim()
    .isLength({
      min: 2,
      max: 600,
    })
    .withMessage('Book title requires at least 2 chars and max 600 chars.'),
  body('language')
    .isIn(listOfLanguages)
    .withMessage(
      'Language has to be polish/ english/ french/ spanish or german.'
    ),
  body('genre')
    .isArray({ min: 1, max: 3 })
    .withMessage('Genres have to be provided (up to 3).'),
  body('authors')
    .isArray({ min: 1, max: 3 })
    .withMessage('Authos have to be provided (up to 3).'),
  body('pages')
    .isInt({
      min: 1,
      max: 10000,
    })
    .withMessage('Book should have at least 1 page and ant most 10000 pages.'),
  body('published')
    .isInt({
      min: 1900,
      max: 3000,
    })
    .withMessage('Book cannot be puslihed before 1900 and after 3000.'),
  body('publisher')
    .trim()
    .isLength({
      min: 2,
      max: 800,
    })
    .withMessage(
      'Book publisher should have at least 2 chars and max 800 chars.'
    ),
  body('available')
    .optional()
    .isBoolean()
    .withMessage('Must be either True or False.'),
  body('description')
    .trim()
    .optional()
    .isLength({
      max: 1500,
    })
    .withMessage('Description cannot be longer than 1500 chars.'),
];

module.exports = validateBook;
