const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

 router.post('/signup', adminController.postuserdetails);

 router.post('/login', adminController.userlogindetails);

 module.exports = router;