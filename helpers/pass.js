const bcrypt = require('bcryptjs');

module.exports = {
    passwordHasher: function (password) {
        
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password,salt);
        return hash;
    }
}