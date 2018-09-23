const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

require('../models/users');
const Users = mongoose.model('users');

router.get('/login', (req, res) => {
    res.render('users/login');
});


router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/dashboard',
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
});

router.get('/dashboard', (req, res) => {
    res.render('users/dashboard');
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('Success msg', "You are now logged out.");
    res.redirect('/users/login');
});

//TEST code to create user

// router.get('/create', (req, res) => {

//     const newUser = new Users({
//         userName: 'Apurba',
//         password: 'Kolkata@1995',
//         role: 'admin'
//     });

//     bcrypt.genSalt(10, (err, salt) => {
//         if (err) throw err;
//         bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) throw error;
//             newUser.password = hash;
//             newUser.save().then(() => {
//                 console.log('User created')
//             }).catch((err) => {
//                 console.log('User creation error')
//             });
//         })
//     })


//     newUser.save().then(() => console.log('USER CREATED'));
//     res.send('user created');
// });

module.exports = router;