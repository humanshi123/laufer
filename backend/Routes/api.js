const express = require('express');
const router = express.Router();
const { dashboard } = require('../App/Controller/ApiController');

router.post('/calculate-price', dashboard);

module.exports = router;
