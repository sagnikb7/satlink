"use strict"
class UserManage {
    constructor(userModel) {
        this.LocalStrategy = require('passport-local').Strategy;
        this.mongoose = require('mongoose');
        //  this.User = require('../../models/users')
        this.User = userModel;
        this.passport  = require('passport');
    }



    //methods

    addUser() {

    }
    updateUser() {

    }
    deleteUser() {

    }
    readUser() {

    }
    login(passport) {
        passport.use(new this.LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        }, (username, password, done) => {
            this.User.findOne({
                userName: username
            }).then((user) => {
                if (user && user.password == password) {
                    console.log('Login Success');
                    return done(null, user);
                } else {
                    console.log('Login Error');
                    return done(null, false, {
                        message: 'Login Error'
                    });

                }
            })
        }));

        this.passport.serializeUser(function (user, done) {
            done(null, user._id);
        });

        this.passport.deserializeUser(function (id, done) {
            const mongoose = require('mongoose');
            require('../../models/users');
            const User = mongoose.model('users')

            User.findById(id, function(err, user) {
                done(err, user);
              });
        
        });
        

    }

    

}

module.exports = UserManage;