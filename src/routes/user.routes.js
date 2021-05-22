const express = require('express');
const {
  getUsers,
  signup,
  login,
  deleteCountry,
} = require('../controllers/user.controllers');
const { validateUser } = require('../validators/user.validator');

const userRouter = express.Router();

userRouter.get('/', getUsers);

userRouter.post('/', validateUser, signup);

userRouter.post('/login', login);

// countryRouter.put('/:cid', validateUser, updateCountry);

// countryRouter.delete('/:cid', deleteCountry);

module.exports = userRouter;
