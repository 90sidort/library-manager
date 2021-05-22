const express = require('express');
const { getGenres, createGenre } = require('../controllers/genre.controllers');
const validateGenre = require('../validators/genre.validator');

const genresRouter = express.Router();

genresRouter.get('/', getGenres);

genresRouter.post('/', validateGenre, createGenre);

module.exports = genresRouter;
