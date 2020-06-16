const { check } = require('express-validator');
const generateHashedPassword = require('../../utils/generateHashedPassword');

const login = [
  check('acces_id').notEmpty().isLength({ min: 10 }).trim().escape(),

  check('password')
    .notEmpty()
    .isLength({ min: 8 })
    .trim()
    .customSanitizer((password) => {
      return generateHashedPassword(password);
    }),
];

const reset = [
  check('newPassword')
    .notEmpty()
    .isLength({ min: 8 })
    .customSanitizer((password) => {
      return generateHashedPassword(password, bcrypt);
    }),

  check('oldPassword').notEmpty().isLength({ min: 8 }).trim().escape(),
];

module.exports = {
  login,
  reset,
};
