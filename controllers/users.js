const mongoose = require('mongoose');
const User = require('../models/user');
const {
  NOT_FOUND,
  SERV_ERROR,
  INCORRECT_INPUT,
  CREATED,
} = require('../utils/utils');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(SERV_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.id).orFail(new Error('NotFound'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(INCORRECT_INPUT).send({ message: 'Некорректный _id' });
      }
      return res.status(SERV_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(CREATED).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(NOT_FOUND).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(SERV_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  ).orFail(new Error('NotFound'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(INCORRECT_INPUT).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(SERV_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  ).orFail(new Error('NotFound'))
    .then((user) => {
      res.send({ avatar: user.avatar });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(INCORRECT_INPUT).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(SERV_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  postUser,
  updateUser,
  updateUserAvatar,
};
