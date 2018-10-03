const mongoose = require('mongoose');

require('../models/users');
require('../models/customer');
const userModel = mongoose.model('users');
const customerModel = mongoose.model('customer');

module.exports = {

    userCardBadges: function (callback) { //ADMIN user panel badges

        var elementJSON = {
            badge1: {
                icon: '',
                data: ''
            },
            badge2: {
                icon: '',
                data: ''
            },
            badge3: {
                icon: '',
                data: ''
            }
        };

        userModel.countDocuments({
            status: 'active',
            role: 'collector'
        }).then((count) => {
            userModel.countDocuments({
                status: 'deactive',
                role: 'collector'
            }).then((count1) => {
                elementJSON.badge1.icon = "fas fa-user-check";
                elementJSON.badge1.data = count;
                elementJSON.badge2.icon = "fas fa-user-times";
                elementJSON.badge2.data = count1;

                return callback(elementJSON);
            })
        }).catch((err) => {
            console.log(`ERROR: ${err}`);
        });

    },

    customerCardBadges: function (callback) { //ADMIN customer panel badges

        var elementJSON = {
            badge1: {
                icon: '',
                data: ''
            },
            badge2: {
                icon: '',
                data: ''
            },
            badge3: {
                icon: '',
                data: ''
            }
        };

        customerModel.countDocuments({
            status: 'active'
        }).then((count) => {
            elementJSON.badge1.icon = "fas fa-user-check";
            elementJSON.badge1.data = count;


        }).then(() => {
            elementJSON.badge2.icon = "fas fa-user-times";
        }).then(() => {
            return callback(elementJSON);
        }).catch((err) => {
            console.log(`ERROR: ${err}`);
        });

    }


}