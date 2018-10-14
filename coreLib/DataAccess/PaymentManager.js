"use strict"
class PaymentManage {
    constructor(paymentModel) {
        this.mongoose = require('mongoose');
        this.payment = paymentModel;
    }

    //METHODS 

    viewPaymentById(paymentID,callback){
        this.payment.findById(paymentID).then(payment=>{
            return callback(payment);
        }).catch((err)=>{
            return callback(false);
        })
    }
    viewPaymentsByCollector(collectorID,callback){
        this.payment.find({collected_by:collectorID}).limit(10).sort({date:'desc'}).then((paymentRecords)=>{

            
            callback(paymentRecords);
        }).catch((err)=>{
            console.log("Payment Record fetch error",err);
            callback(false);
        })
    }

    viewPaymentsByCustomer(customerID,callback){
        this.payment.find({customer:customerID}).limit(24).sort({date:'desc'}).then((paymentRecords)=>{

            
            callback(paymentRecords);
        }).catch((err)=>{
            console.log("Payment Record fetch error",err);
            callback(false);
        })
    }


    recordPayment(paymentObj, callback) {

        this.payment.findOne({
            customer: paymentObj.customer
        }).and([{
            payment_month: paymentObj.payment_month
        }, {payment_year: paymentObj.payment_year}]).then((user)=>{


            if(user){
                return callback({status:'ERROR',data:user})
            }else{
                var newPayment = new this.payment(paymentObj);
                newPayment.save().then(()=>{
                    return callback({status:'SUCCESS',data:newPayment});
                }).catch((err)=>{
                    console.log("DB error",err)
                })
                //---
                
            }
           
        })

    }
}

module.exports = PaymentManage;