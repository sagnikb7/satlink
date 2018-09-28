//sample path = 'localhost/admin/customer'

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const userManager = require('../../coreLib/DataAccess/UserManager');

const {
    check,
    validationResult
} = require('express-validator/check');

//mongoose model
require('../../models/users');
const userModel = mongoose.model('users');

//form check parameters
const minPasswordLength = 8;

//HELPER
const {
    ensureAuthenticatedAdmin,
    ensureNonAuthenticated,
    ensureAuthenticated
} = require('../../helpers/auth');
const {
    passwordHasher
} = require('../../helpers/pass');


//routes
router.get('/add', ensureAuthenticatedAdmin, (req, res) => {
    res.render('users/admin/customer/add');
});

router.get('/manage-login', ensureAuthenticatedAdmin, (req, res) => {
    res.render('users/admin/customer/manage-login');
});

router.post('/manage-login', ensureAuthenticatedAdmin, [
    check('password').isLength({
        min: minPasswordLength
    }),
    check('password2').custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            throw new Error("Both passwords must match");
        } else {
            return true;
        }
    })
], (req, res) => {

    const formErrors = validationResult(req);
    if (!formErrors.isEmpty()) {
        console.log(formErrors.array());
        res.render('users/admin/customer/manage-login', {
            formErrors: formErrors.array()
        });
    } else {

        var hash = passwordHasher(req.body.password);

        const updatedUser = {
            password: hash,
        }
        var userManagerObj = new userManager(userModel);
        userModel.findOne({
            role: 'customer'
        }).then((user) => {
            userManagerObj.updateUser(user._id, updatedUser, status => {
                if (status) {
                    req.flash('Success msg', "Account details updated");
                    res.redirect('/users/dashboard');
                } else {
                    req.flash('Error msg', "Account details not updated");
                    res.redirect('/users/dashboard');
                }
            })
        })

    }
});
module.exports = router;