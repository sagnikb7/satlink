//sample path = 'localhost/admin/user'

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userManager = require('../../coreLib/DataAccess/UserManager');

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
} = require('../../helpers/auth');
const {
    passwordHasher
} = require('../../helpers/pass');


//mongoose model
require('../../models/users');
const userModel = mongoose.model('users');

//user manage view
router.get('/manage', ensureAuthenticatedAdmin, (req, res) => {
    var userManagerObj = new userManager(userModel);
    userManagerObj.readAllByRole('collector', status => {
        if (status) {
            res.render('users/admin/user/manage', {
                users: status
            });
        } else {
            console.log("Error");
        }
    });

});


///user manage (update) view
router.get('/manage/:id', ensureAuthenticatedAdmin, (req, res) => {
    // res.send(req.params.id);
    var userManagerObj = new userManager(userModel);
    userManagerObj.readUser(req.params.id, (status) => {
        if (status) {
            // console.log(status);
            res.render('users/admin/user/manage-id', {
                user: status
            });
        } else {
            res.redirect('/');
        }
    });


})

router.post('/manage/password-change/:id', ensureAuthenticatedAdmin, [check('password').isLength({
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
    // res.send(req.body);
    const formErrors = validationResult(req);
    if (!formErrors.isEmpty()) {
        req.flash('Error msg',"Both Passwords should match and should be atleast 8 characters long");
        res.redirect('/admin/user/manage/'+req.params.id);
    } else {
        var hash = passwordHasher(req.body.password);
        const updatedUser = {
            password: hash
        }
        var userManagerObj = new userManager(userModel);
       
            userManagerObj.updateUser(req.params.id, updatedUser, (status) => {
                if (status) {
                    req.flash('Success msg', "User Account details updated");
                    res.redirect('/admin/user/manage');
                } else {
                    req.flash('Error msg', "User Account details not updated");
                    res.redirect('/admin/user/manage');

                }
            })
    
    }

})
//user deactivate account 

router.post('/manage/deactivate-account/:id',ensureAuthenticatedAdmin,[
    check('status').isIn(['active','deactive'])
],(req,res)=>{

    // res.send(req.body);
    const formErrors = validationResult(req);
    if (!formErrors.isEmpty()) {
        req.flash('Error msg',"Form validation error");
        res.redirect('/admin/user/manage/'+req.params.id);
    
    } else {
        const updatedUser = {
            status:req.body.status
        }

        var userManagerObj = new userManager(userModel);
        userManagerObj.updateUserStatus(req.params.id,updatedUser,status=>{
            if(status){
                req.flash('Success msg', "Account Status updated");
                    res.redirect('/admin/user/manage');

            }else{
                req.flash('Error msg', "There was an issue!");
                    res.redirect('/admin/user/manage');

            }
        })
    }
})

//user add view
router.get('/add', ensureAuthenticatedAdmin, (req, res) => {
    res.render('users/admin/user/add');
});

//user add post
router.post('/add', ensureAuthenticatedAdmin, [
    check('role').isIn(['collector']),

    check('username').not().isEmpty().isAlphanumeric().custom((value) => {
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
        userManagerObj.addUser(newUser, status => {

            if (status) {
                req.flash('Success msg', "User created");
                res.redirect('/users/dashboard');

            } else {
                req.flash('Error msg', "User not created");
                res.redirect('/users/dashboard');
            }
        });

        // if(status){
        //     req.flash('Success msg',"User created");
        //     res.redirect('/users/dashboard');

        // }else{
        //     req.flash('Error msg',"User not created");
        //     res.redirect('/users/dashboard');
        // }
    }



});

module.exports = router;