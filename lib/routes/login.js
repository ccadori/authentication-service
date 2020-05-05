const express = require('express');
const router = express.Router();

const model = require('../model/login');

router.post('/', async (req, res, next) => {
  const result = await model.create(req.body.email, req.body.password);

  if (result.error)
    return res.status(500).send(result.error);
  
  return res.status(200).send({ token: result.data });
});

router.post('/logout', async (req, res, next) => {
  const result = await model.logout(req.body.token);

  if (result.error)
    return res.status(500).send(result.error);
  
  return res.status(200).send();
});

router.get('/verify', async (req, res, next) => {
  return res.status(200).send();
});

module.exports = router;
