const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  NOT_FOUND,
  SERV_ERROR,
  INCORRECT_INPUT,
  CREATED,
} = require('../utils/utils');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ cards });
    })
    .catch(() => {
      res.status(SERV_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const postCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => {
      res.status(CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(INCORRECT_INPUT).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(SERV_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then(() => {
      res.send({ card: 'Пост удален!' });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(INCORRECT_INPUT).send({ message: 'Некорректный _id' });
      }
      return res.status(SERV_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const setLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error('NotFound'))
    .then((card) => {
      res.send(card.likes);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(INCORRECT_INPUT).send({ message: 'Некорректный _id' });
      }
      return res.status(SERV_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error('NotFound'))
    .then((card) => {
      res.send(card.likes);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(INCORRECT_INPUT).send({ message: 'Некорректный _id' });
      }
      return res.status(SERV_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  setLikeCard,
  deleteLikeCard,
};
