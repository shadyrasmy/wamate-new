const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public webhook endpoint (Fawaterak will call this)
router.post('/webhook', paymentController.webhook);

// Protected routes
router.use(protect);

router.post('/create-invoice', paymentController.createInvoice);
router.get('/verify/:invoiceId', paymentController.verifyPayment);

module.exports = router;
