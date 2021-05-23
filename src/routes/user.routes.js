const express = require('express');
const {
  getUsers,
  signup,
  login,
  updateUser,
  deleteUser,
  archiveUser,
} = require('../controllers/user.controllers');
const {
  validateUser,
  validateUserUpdate,
} = require('../validators/user.validator');

const userRouter = express.Router();

userRouter.get('/', getUsers);

userRouter.post('/', validateUser, signup);

userRouter.post('/login', login);

userRouter.put('/:uid', validateUserUpdate, updateUser);

userRouter.patch('/:uid', archiveUser);

userRouter.delete('/:uid', deleteUser);

module.exports = userRouter;
