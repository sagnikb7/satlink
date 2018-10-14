const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PaymentSchema = new Schema({
    customer:{
        type:Object,
        required:true
    },
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
    },
    advance_payment:{
        type:Number,
        default:0
    },
    under_review:{
        type:Number,
        default:0
    },
    collected_by:{
        type:String,
        required:true
    }
});

mongoose.model('payments', PaymentSchema);