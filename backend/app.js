/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
require('dotenv').config();
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, loginUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const CustomError = require('./errors/CustomError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorReceiver } = require('./middlewares/errorReceiver');

const pageNotFoundError = new CustomError(404, 'Запрашиваемый ресурс не найден', 'pageNotFoundError');

const { PORT = 3005 } = process.env;

const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'https://antares.nomoredomains.xyz',
    'http://antares.nomoredomains.xyz',
  ],
  methods: ['GET', 'PUT', 'PATCH', 'HEAD', 'POST', 'DELETE'],
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use(cors(options));
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(requestLogger);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(new RegExp('^(https?:\/\/)?(www\.)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*[\/\#]?$')),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), loginUser);

app.get('/signout', (req, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Выход' });
});

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

app.get('*', (req, res, next) => {
  next(pageNotFoundError);
});

app.use(errorLogger);

app.use(errors());

app.use(errorReceiver);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
