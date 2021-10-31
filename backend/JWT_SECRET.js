require('dotenv').config();

const { JWT_SECRET = 'qwertyasdfgh' } = process.env;
module.exports = {
  JWT_SECRET,
};
