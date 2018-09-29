//sample path = 'localhost/collector'

const express = require('express');
const router = express.Router();

const paymentRoute = require('./collector/payment')
router.use('/payment', paymentRoute);

module.exports = router;