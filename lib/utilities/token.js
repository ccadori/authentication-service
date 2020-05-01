const jwt = require('jsonwebtoken');
const config = require('../../config.json');

const Token = {
  create: async (payload) => {
    return jwt.sign(payload, config.secret, { expiresIn: 60 });
  },
  verify: async (token) => {
    return jwt.verify(token, config.secret);
  }
}

module.exports = Token;
