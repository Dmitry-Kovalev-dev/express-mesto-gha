const cardRouter = require('express').Router();

const {
  getCards,
  postCard,
  deleteCard,
  setLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', postCard);
cardRouter.delete('/cards/:cardId', deleteCard);
cardRouter.put('/cards/:cardId/likes', setLikeCard);
cardRouter.delete('/cards/:cardId/likes', deleteLikeCard);

module.exports = cardRouter;
