module.exports = {
    ensureAuthenticatedAdmin: function (req, res, next) {
        if (req.isAuthenticated() && req.user.role == 'admin') {
            return next();
        } else {
            req.flash('Error msg', 'Dont get lost!');
            res.redirect('/users/dashboard');
        }
    },
    ensureNonAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/');
        } else {
            return next();
        }
    },

    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/');
        }
    }
}