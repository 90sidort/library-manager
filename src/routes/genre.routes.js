const express = require('express');
const {
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
} = require('../controllers/genre.controllers');
const validateGenre = require('../validators/genre.validator');
const requireLogin = require('../middleware/requireLogin');

const genresRouter = express.Router();

genresRouter.get('/', requireLogin, getGenres);

genresRouter.post('/', requireLogin, validateGenre, createGenre);

genresRouter.put('/:gid', requireLogin, validateGenre, updateGenre);

genresRouter.delete('/:gid', requireLogin, deleteGenre);

module.exports = genresRouter;
