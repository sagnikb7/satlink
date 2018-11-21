//sample path = 'localhost/admin/customer'

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const userManager = require('../../coreLib/DataAccess/UserManager');
const customerManager = require('../../coreLib/DataAccess/CustomerManager');

const {
    check,
    validationResult
} = require('express-validator/check');

//mongoose model
require('../../models/users');
require('../../models/customer');

const userModel = mongoose.model('users');
const customerModel = mongoose.model('customer');

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

//add customer
router.post('/add', ensureAuthenticatedAdmin, [
    check('stb_no').not().isEmpty().isAlphanumeric(),
    check('vc_no').not().isEmpty().isNumeric(),
    check('name').not().isEmpty(),
    check('contact').isNumeric().custom((value) => {
        if (value.length == 10) {
            return true;
        } else {
            throw new Error('Contact number must be 10 digits');
        }
    })
], (req, res) => {

    const formErrors = validationResult(req);

    if (!formErrors.isEmpty()) {
        res.render('users/admin/customer/add', {
            formErrors: formErrors.array()
        });
    } else {

        var customerObj = new customerManager(customerModel);

        var newCustomer = {
            stb_no: req.body.stb_no,
            vc_no: req.body.vc_no,
            name: req.body.name,
            contact_no: req.body.contact
        }


        customerObj.addCustomer(newCustomer, (status) => {
            if (status) {
                req.flash('Success msg', "Customer details added, CABLE CARD No : " + status);
                res.redirect('/users/dashboard');

            } else {
                req.flash('Error msg', "A Customer with same STB or VC number exists");
                res.redirect('/admin/customer/add');
            }
        })

    }



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
        // console.log(formErrors.array());
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

router.get('/manage/:page', ensureAuthenticatedAdmin,(req,res)=>{
  
    var customerObj = new customerManager(customerModel);
    customerObj.getAllCustomer(req.params.page,(data)=>{
        if(data){

            var pages = [];
            for (i=1;i<=data.pages;i++){
                if(i == req.params.page){
                    pages.push({number:i,active:'active'});
                }else{
                    pages.push({number:i,active:''});
                }
               
            }
           
            var records = data.docs;
            var mainData = {pages:pages,records:records}
            res.render('users/admin/customer/manage',{data:mainData});
        }else{
            console.log("No cutomer data");
        }
    })
    
   
})
module.exports = router;