//sample path = 'localhost/collector/payment'

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//HELPER
const {
    ensureAuthenticatedCollector,
    ensureNonAuthenticated,
    ensureAuthenticated
} = require('../../helpers/auth');

router.get('/collect',ensureAuthenticatedCollector,(req,res)=>{
    res.render('users/collector/payment/collect');
});

module.exports = router;