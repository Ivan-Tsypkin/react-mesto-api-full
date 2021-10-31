const jwt = require('jsonwebtoken');
const CustomError = require('../errors/CustomError');
const { JWT_SECRET } = require('../JWT_SECRET');

const authError = new CustomError(401, 'Необходима авторизация', 'AuthError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw authError;
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw authError;
  }

  req.user = payload;

  return next();
};
