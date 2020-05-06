const express = require('express');
const router = express.Router();

const model = require('../model/login');
const getConnection = require('../schema');

router.post('/', async (req, res, next) => {
  const connection = await getConnection();
  const result = await model.create(req.body.email, req.body.password, connection);

  if (result.error)
    return res.status(result.error.code).send(result.error);
  
  return res.status(200).send({ token: result.data });
});

router.post('/logout', async (req, res, next) => {
  const connection = await getConnection();
  const result = await model.logout(req.body.token, connection);

  if (result.error)
    return res.status(result.error.code).send(result.error);
  
  return res.status(200).send();
});

router.get('/verify', async (req, res, next) => {
  const connection = await getConnection();
  const result = await model.verifiy(req.query.token);

  if (result.error)
    return res.status(result.error.code).send(result.error);

  return res.status(200).send();
});

module.exports = router;
