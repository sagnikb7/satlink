const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    stb_no: {
        required: true,
        type: String,
        uppercase: true
    },
    vc_no: {
        required: true,
        type: Number
    },
    cable_card_no: {

        required: true,
        type: String,
        uppercase: true,
        unique: true
    },
    name: {
        required: true,
        type: String,
        uppercase: true

    },
    contact_no: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'active'
    }
});

mongoose.model('customer', CustomerSchema);