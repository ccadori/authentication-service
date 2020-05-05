const express = require('express');
const router = express.Router();

const model = require('../model/login');
const blockedModel = require('../model/blocked');

router.post('/', async (req, res, next) => {
  const result = await model.create(req.body.email, req.body.password);

  if (result.error)
    return res.status(500).send(result.error);
  
  return res.status(200).send({ token: result.data });
});

router.delete('/', async (req, res, next) => {
  const result = await blockedModel.create(req.body.token);

  if (result.error)
    return res.status(500).send(result.error);
  
  return res.status(200).send();
});

module.exports = router;
