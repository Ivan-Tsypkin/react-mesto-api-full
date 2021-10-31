/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const CustomError = require('../errors/CustomError');
const { JWT_SECRET } = require('../JWT_SECRET');

const userNotFoundError = new CustomError(404, 'Пользователь не найден', 'UserNotFoundError');
const mongoServerError = new CustomError(409, 'Пользователь уже зарегистрирован!', 'MongoServerError');

module.exports.createUser = (req, res, next) => bcrypt.hash(req.body.password, 10)
  .then((hash) => User.create({
    email: req.body.email,
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
    password: hash,
  }))
  .then((user) => res.send({
    name: user.name, about: user.about, avatar: user.avatar, email: user.email,
  }))
  .catch((err) => {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return next(mongoServerError);
    }
    return next(err);
  });

module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'none',
          secure: false,
        })
        .send({ message: 'Вход выполнен!' });
    })
    .catch(next);
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  let { id } = req.params;
  if (id === 'me' || id === undefined) {
    id = req.user._id;
  }
  User.findById(id)
    .orFail(() => { throw userNotFoundError; }) // Если пользователь не найден, генерируем ошибку
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => { throw userNotFoundError; }) // Если пользователь не найден, генерируем ошибку
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => { throw userNotFoundError; }) // Если пользователь не найден, генерируем ошибку
    .then((user) => res.status(200).send(user))
    .catch(next);
};
