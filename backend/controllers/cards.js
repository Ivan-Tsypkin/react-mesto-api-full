/* eslint-disable no-console */
const Card = require('../models/card');
const CustomError = require('../errors/CustomError');

const cardNotFoundError = new CustomError(404, 'Карточка не найдена!', 'CardNotFoundError');
const deleteError = new CustomError(403, 'Удалять можно только свои карточки!', 'DeleteError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { user } = req;

  Card.create({ name, link, owner: user })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => { throw cardNotFoundError; })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw deleteError;
      }

      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => res.send({ message: `Карточка ${card.name}, id:${card._id} - удалена!` }))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { throw cardNotFoundError; }) // Если карточка не найдена, генерируем ошибку
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { throw cardNotFoundError; }) // Если карточка не найдена, генерируем ошибку
    .then((card) => res.send(card))
    .catch(next);
};
