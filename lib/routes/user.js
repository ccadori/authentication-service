const express = require('express');
const router = express.Router();
const model = require('../model/user');

router.post('/', async (req, res, next) => {
  const result = await model.create(
    req.body.username, 
    req.body.email, 
    req.body.password, 
    req.body.customFields
  );
  
  if (result.error)
    return res.status(500).send(result.error);

  return res.status(200).send(result.data);
});

module.exports = router;
