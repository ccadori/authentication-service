const jwt = require('jsonwebtoken');
const config = require('../../config.json');

const Token = {
  create: async (payload) => {
    return jwt.sign(payload, config.secret, { expiresIn: 60 });
  },
  verify: async (token) => {
    try {
      return jwt.verify(token, config.secret);
    } catch (err) {
      return false;
    }
  }
}

module.exports = Token;
