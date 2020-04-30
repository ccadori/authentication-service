const mongoose = require('mongoose');
const config = require('../../config.json');

const models = [
  require('./users'),
];

let connection = null;

const newConnection = async () => {
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  let connection = await mongoose.connect(config.database.uri, options);

  for (let model of models) connection = model(connection);

  return connection;
};

const getConnection = async () => {
  if (connection) return connection;

  connection = await newConnection();
  
  return connection;
};

module.exports = getConnection;