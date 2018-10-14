"use strict"
class CustomerManage {
    constructor(CustomerModel) {

        this.mongoose = require('mongoose');
        //  this.User = require('../../models/users')
        this.Customer = CustomerModel;

    }



    //methods

    //ADD customers to DB with validation
    addCustomer(newCustomer, callback) {

        //find duplicacy
        this.Customer.findOne().or([{
            stb_no: newCustomer.stb_no
        }, {
            vc_no: newCustomer.vc_no
        }]).where('status').equals('active').then((user) => {
            if (user) {
                return callback(false);
            } else {

                //add 
                var newCust = new this.Customer(newCustomer);
                //add cable card number 
                this.Customer.countDocuments({}).then((result) => {

                    var Id = parseInt(result, 10) + 1
                    var cableCardNo = 'C' + Id;
                    newCust.cable_card_no = cableCardNo;

                    newCust.save().then(() => {
                        return callback(cableCardNo);
                    }).catch((err) => {
                        console.log(`CUSTOMER SAVE ERROR: ${err}`);
                    });
                })


            }
        }).catch((err) => {
            console.log(`QUERRY ERROR: ${err}`);
        })


    };

    fetchCustomer(cable_card_no, callback) {

        this.Customer.findOne({
            cable_card_no: cable_card_no
        }).where('status').equals('active').then((Customer) => {
            if (Customer) {

                return callback(Customer);

            } else {
                return callback(false);
            }

        }).catch((err) => {
            console.log("Customer fetch error");
        })

    };

}

module.exports = CustomerManage;