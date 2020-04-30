const express = require('express');
const bodyParser = require('body-parser')
const app = express();

const routes = require('./lib/routes');

app.use(bodyParser.json());
routes(app);

app.listen(3000);
