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
const requireAdmin = require('../middleware/isAdmin');

const userRouter = express.Router();

userRouter.get('/', requireAdmin, getUsers);

userRouter.post('/', validateUser, signup);

userRouter.post('/login', login);

userRouter.put('/:uid', requireLogin, validateUserUpdate, updateUser);

userRouter.patch('/admin/:uid', requireAdmin, addAdmin);

userRouter.patch('/:uid', requireAdmin, archiveUser);

userRouter.delete('/:uid', requireAdmin, deleteUser);

module.exports = userRouter;
