const express = require('express');

const premiumController = require('../controllers/premiumfeatures');

const userauthentication = require('../middleware/auth');

const router = express.Router();

 router.get('/showleaderboard', userauthentication.authenticate, premiumController.getleaderboarddetails);

 
 module.exports = router;