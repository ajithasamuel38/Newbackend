const express = require('express');

const purchaseController = require('../controllers/premium');

const userauthentication = require('../middleware/auth');

const router = express.Router();

 router.get('/premium', userauthentication.authenticate, purchaseController.purchase);

 router.post('/update-premium-status', userauthentication.authenticate, purchaseController.updateTransactionstatus);

 router.get('/check-premium-status', userauthentication.authenticate, purchaseController.checkPremiumStatus);
 
 module.exports = router;