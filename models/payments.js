const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PaymentSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    payment_month: {
        type: Number,
        required: true
    },
    payment_year: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('payments', PaymentSchema);