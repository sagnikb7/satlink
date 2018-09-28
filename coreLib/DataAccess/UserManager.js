"use strict"
class UserManage {
    constructor(userModel) {
        this.LocalStrategy = require('passport-local').Strategy;
        this.mongoose = require('mongoose');
        //  this.User = require('../../models/users')
        this.User = userModel;
        this.passport = require('passport');
        this.bcrypt = require('bcryptjs');
    }



    //methods

    addUser(user, callback) {

        const newUser = new this.User(user);
        newUser.save().then(() => {
            return callback(true);
        }).catch((err) => {
            return callback(false);
        });

    }
    updateUser(userId,userUpdated,callback) {
        this.User.findById(userId).then((user)=>{
            user.password = userUpdated.password;
            user.save().then(()=>{return callback(true);}).catch((err)=>{
                return callback(false);
            });
        })
    }
    softDeleteUser(userId, callback) {
        this.User.findById(userId).then((user) => {
            user.status = 'deactive';
            user.save().then(() => {
                return callback(true);
            }).catch((err) => {
                return callback(false);
            });
        })
    }
    readUser(username, callback) {
        this.User.findOne({
            userName: username
        }).then((user) => {
            return callback(user);
        }).catch((err) => {
            return callback(false);
        });
    }
    login(passport) {
        passport.use(new this.LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        }, (req, username, password, done) => {
            this.User.findOne({
                userName: username
            }).then((user) => {
                if (user) {

                    this.bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            // console.log('Login Success');
                            return done(null, user);
                        } else {
                            // console.log('Login Error wrong password');
                            return done(null, false, req.flash('Error msg', "Incorrect Password"));

                        }
                    })

                } else {
                    // console.log('Login Error user does not exist');
                    return done(null, false, req.flash('Error msg', "User does not exist"));

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

            User.findById(id, function (err, user) {
                done(err, user);
            });

        });


    }



}

module.exports = UserManage;