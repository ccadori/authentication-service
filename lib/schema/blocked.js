const mongoose = require('mongoose');

module.exports = connection => {
  const Schema = new mongoose.Schema({
    token: String,
  });

  connection.model('blockeds', Schema);
  
  return connection;
}
