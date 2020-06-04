const jwt = require('jsonwebtoken');
const secret = process.env.AUTH_SECRET
module.exports = (id, permission) => {
    return jwt.sign({ id: id, permission: permission }, secret);
}