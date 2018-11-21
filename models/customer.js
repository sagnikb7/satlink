const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate  = require('mongoose-paginate');
const CustomerSchema = new Schema({
    stb_no: {
        required: true,
        type: String,
        uppercase: true
    },
    vc_no: {
        required: true,
        type: String
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

CustomerSchema.plugin(mongoosePaginate);

mongoose.model('customer', CustomerSchema);