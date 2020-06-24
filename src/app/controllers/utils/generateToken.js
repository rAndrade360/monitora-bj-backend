const jwt = require('jsonwebtoken');

const secret = process.env.AUTH_SECRET;
module.exports = (id, permission) => {
  return jwt.sign({ id, permission }, secret, {
    expiresIn: '1d',
  });
};
