const bcrypt = require('bcrypt');

const Password = {
  encrypt: async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  },
  check: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  }
};

module.exports = Password;
