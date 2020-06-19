const bcrypt = require('bcrypt');

module.exports = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};
