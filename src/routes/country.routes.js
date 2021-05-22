const express = require('express');
const {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
} = require('../controllers/country.controllers');
const validateCountry = require('../validators/country.validator');

const countryRouter = express.Router();

countryRouter.get('/', getCountries);

countryRouter.post('/', validateCountry, createCountry);

countryRouter.put('/:cid', validateCountry, updateCountry);

countryRouter.delete('/:cid', deleteCountry);

module.exports = countryRouter;
