const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', orderController.getOrders);
router.get('/export', orderController.exportOrders);
router.patch('/:orderId', orderController.updateOrder);

module.exports = router;
