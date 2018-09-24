const express = require('express');
const mongoose = require('mongoose');
const userManager = require('../coreLib/DataAccess/UserManager');
const {
    passwordHasher
} = require('../helpers/pass');
//mongoose model
require('../models/users');
const userModel = mongoose.model('users');



const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator/check');

//form check parameters
const minPasswordLength = 8;

//HELPER

const {
    ensureAuthenticatedAdmin,
    ensureNonAuthenticated,
    ensureAuthenticated
} = require('../helpers/auth');

router.get('/user/add', ensureAuthenticatedAdmin, (req, res) => {
    res.render('users/admin/user/add');
});

router.post('/user/add', ensureAuthenticatedAdmin, [
    check('role').isIn(['collector']),

    check('username').not().isEmpty().custom((value) => {
        return userModel.findOne({
            userName: value
        }).then((user) => {
            if (user) {
                return Promise.reject('Username already exists');
            }
        });
    }),

    check('password').isLength({
        min: minPasswordLength
    }),
    check('password2').custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            throw new Error('Both passwords are not same.')
        } else {
            return true;
        }
    })
], (req, res) => {



    const formErrors = validationResult(req);
    if (!formErrors.isEmpty()) {
        // console.log(formErrors.array());
        res.render('users/admin/user/add', {
            formErrors: formErrors.array()
        });
    } else {
        var hash = passwordHasher(req.body.password);

        const newUser = {
            userName: req.body.username,
            password: hash,
            role: req.body.role
        }

        var userManagerObj = new userManager(userModel);
        var status = userManagerObj.addUser(newUser);
        console.log(status);
        if(status){
            req.flash('Success msg',"User created");
            res.redirect('/users/dashboard');

        }else{
            req.flash('Error msg',"User not created");
            res.redirect('/users/dashboard');
        }
    }



});


module.exports = router;