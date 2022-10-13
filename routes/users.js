const userRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  postUser,
  updateUser,
  updateUserAvatar
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:id', getUserById);
userRouter.post('/users', postUser);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = userRouter;
