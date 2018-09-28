//sample path = 'localhost/admin'

const express = require('express');
const router = express.Router();

//ROUTES
const userRoute = require('./admin/user');
const customerRoute = require('./admin/customer');

router.use('/user',userRoute);
router.use('/customer',customerRoute);





module.exports = router;