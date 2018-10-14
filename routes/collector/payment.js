//sample path = 'localhost/collector/payment'

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CustomerModel = mongoose.model('customer');
//HELPER
const {
    ensureAuthenticatedCollector,
    ensureNonAuthenticated,
    ensureAuthenticated
} = require('../../helpers/auth');

//classes
const CustomerManager = require("../../coreLib/DataAccess/CustomerManager");

router.get('/collect',ensureAuthenticatedCollector,(req,res)=>{
    res.render('users/collector/payment/collect');
});

router.post('/collect',ensureAuthenticatedCollector,(req,res)=>{
    // res.send(req.body);
    var CustomerObj = new CustomerManager(CustomerModel);
    CustomerObj.fetchCustomer(req.body.search,customer=>{
        if(customer){
            res.render('users/collector/payment/collect',{customer:customer});

        }else{
            req.flash("Error msg","No customer found!");
            res.redirect('/collector/payment/collect');
        }
    })

});

router.post('/confirm',ensureAuthenticatedCollector,(req,res)=>{
    res.send(req.body);
})

module.exports = router;