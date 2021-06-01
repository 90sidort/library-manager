const express = require('express');
const {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
} = require('../controllers/country.controllers');
const validateCountry = require('../validators/country.validator');
const requireLogin = require('../middleware/requireLogin');

const countryRouter = express.Router();

countryRouter.get('/', requireLogin, getCountries);

countryRouter.post('/', requireLogin, validateCountry, createCountry);

countryRouter.put('/:cid', requireLogin, validateCountry, updateCountry);

countryRouter.delete('/:cid', requireLogin, deleteCountry);

module.exports = countryRouter;
