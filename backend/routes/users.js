const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers, getUserById, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');
const { RegExpForUrl } = require('../REG_EXPS');

router.get('/', getAllUsers);
router.get('/me', getUserById);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().required().pattern(new RegExp(`${RegExpForUrl}`)),
  }),
}), updateUserAvatar);

module.exports = router;
