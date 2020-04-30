const mongoose = require('mongoose');

module.exports = connection => {
  const Schema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    customFields: Array,
  });

  connection.model('users', Schema);
  
  return connection;
}
