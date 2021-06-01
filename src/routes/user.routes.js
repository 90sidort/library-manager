const express = require('express');
const {
  getUsers,
  signup,
  login,
  updateUser,
  deleteUser,
  archiveUser,
  addAdmin,
} = require('../controllers/user.controllers');
const {
  validateUser,
  validateUserUpdate,
} = require('../validators/user.validator');
const requireLogin = require('../middleware/requireLogin');

const userRouter = express.Router();

userRouter.get('/', requireLogin, getUsers);

userRouter.post('/', validateUser, signup);

userRouter.post('/login', login);

userRouter.put('/:uid', requireLogin, validateUserUpdate, updateUser);

userRouter.patch('/admin/:uid', requireLogin, addAdmin);

userRouter.patch('/:uid', requireLogin, archiveUser);

userRouter.delete('/:uid', requireLogin, deleteUser);

module.exports = userRouter;
