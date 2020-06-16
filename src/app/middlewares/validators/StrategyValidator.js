const { check } = require('express-validator');
const generateHashedPassword = require('../../utils/generateHashedPassword');

const store = [
  check('strategy.name').notEmpty().trim().escape(),

  check('strategy.access_id').notEmpty().isLength({ min: 8 }).trim(),

  check('strategy.permission')
    .notEmpty()
    .isIn(['test_center', 'basic_unity'])
    .trim(),

  check('strategy.password')
    .notEmpty()
    .isLength({ min: 8 })
    .customSanitizer((password) => generateHashedPassword(password)),
];
const login = [
  check('access_id').notEmpty().isLength({ min: 8 }).trim(),
  check('password').notEmpty().isLength({ min: 8 }).trim(),
];
module.exports = {
  store,
  login,
};
