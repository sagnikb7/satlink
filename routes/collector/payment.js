//sample path = 'localhost/collector/payment'

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {
    check,
    validationResult
} = require('express-validator/check');

//mongoose model 
require("../../models/customer");
require("../../models/payments");

const CustomerModel = mongoose.model('customer');
const PaymentModel = mongoose.model('payments');
//HELPER
const {
    ensureAuthenticatedCollector,
    ensureNonAuthenticated,
    ensureAuthenticated
} = require('../../helpers/auth');

//classes
const CustomerManager = require("../../coreLib/DataAccess/CustomerManager");
const PaymentManager = require("../../coreLib/DataAccess/PaymentManager");

router.get('/collect', ensureAuthenticatedCollector, (req, res) => {
    res.render('users/collector/payment/collect');
});

router.post('/collect', ensureAuthenticatedCollector, (req, res) => {
    // res.send(req.body);
    var CustomerObj = new CustomerManager(CustomerModel);
    CustomerObj.fetchCustomer(req.body.search, customer => {
        if (customer) {
            res.render('users/collector/payment/collect', {
                customer: customer
            });

        } else {
            req.flash("Error msg", "No customer found!");
            res.redirect('/collector/payment/collect');
        }
    })

});


router.post('/confirm', ensureAuthenticatedCollector, [
    check('amount').isNumeric({
        min: 10
    }),
  
], (req, res) => {

    var dateArray = req.body.datePicker.split("-");

    var newPayment = {
        customer: req.body.customer_id,
        amount: req.body.amount,
        payment_month: dateArray[0],
        payment_year: dateArray[1],
        collected_by: res.locals.user._id
    }

    const formErrors = validationResult(req);
    if (!formErrors.isEmpty()) {
        console.log(formErrors.array());
        res.render('users/collector/payment/collect');
    } else {

        var paymentObj = new PaymentManager(PaymentModel);
        paymentObj.recordPayment(newPayment, (status) => {
            if (status.status == 'ERROR') {
                // console.log(status);
                req.flash("Error msg","Payment already collected from this customer, for the desired month. For further details review PAYMENT HISTORY.")
                res.redirect("/collector/payment/collect");
            } else {
                req.flash("Success msg","Payment Recorded Successfully.");
                res.redirect("/collector/payment/review");
            }
        });

    }



})

router.get('/review',ensureAuthenticatedCollector,(req,res)=>{
    var paymentObj = new PaymentManager(PaymentModel);
    
    // showLoadingSymbol('#divId');
    paymentObj.viewPaymentsByCollector(res.locals.user._id,(payments)=>{
        if(payments){
            payments.forEach((Element)=>{
                var CustomerObj = new CustomerManager(CustomerModel);
                CustomerObj.fetchCustomerById(Element.customer,(customer)=>{
                    if(customer){
                        Element.customer = customer.name;
                    }
                    // if(counter == endoFLoop){
                    //     hideLoadingSymbol('#divId');
                    // }
                })

            })
            res.render('users/collector/payment/review',{payments:payments});
        }else{
        res.send("Payment fetch error");
        }
    })
  
})
router.post('/reciept',ensureAuthenticatedCollector,(req,res)=>{
    var paymentObj = new PaymentManager(PaymentModel);
    paymentObj.viewPaymentById(req.body.paymentId,(payment)=>{
        if(payment){
            res.render('users/collector/payment/receipt',{payment:payment});
        }else{
            res.send("Invalid Payment ID");
        }
    })
   
})

router.post('/payment-history',ensureAuthenticatedCollector,(req,res)=>{
    var paymentObj = new PaymentManager(PaymentModel);
    paymentObj.viewPaymentsByCustomer(req.body.customerId,(payments)=>{
        if(payments){
            res.render('users/collector/payment/payment-history',{payments:payments});
        }else{
            res.send("Payment fetch error");
        }
    })

});

module.exports = router;