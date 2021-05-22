const express = require('express');
const {
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
} = require('../controllers/genre.controllers');
const validateGenre = require('../validators/genre.validator');

const genresRouter = express.Router();

genresRouter.get('/', getGenres);

genresRouter.post('/', validateGenre, createGenre);

genresRouter.put('/:gid', validateGenre, updateGenre);

genresRouter.delete('/:gid', deleteGenre);

module.exports = genresRouter;
