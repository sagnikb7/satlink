const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        lowercase: true,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

});

mongoose.model('users',UserSchema);