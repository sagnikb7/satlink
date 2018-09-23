const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const flash = require('connect-flash');
require("../models/users");
const User = mongoose.model('users');

module.exports = function(passport){
    let currentUser = User;
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
        User.findOne({
            userName: username
        }).then((User) => {
            if (User && User.password == password) {
                console.log('Login Success');
                return done(null, User);
            } else {
                console.log('Login Error');
                return done(null, false, {
                    message: 'Login Error'
                });

            }
        }).catch((err)=>{
            console.log(`Login error -- ${err}`)
        });
    }))


    passport.serializeUser(function(user, done) {
        done(null, user._id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}
