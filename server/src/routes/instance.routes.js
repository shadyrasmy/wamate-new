const express = require('express');
const router = express.Router();
const instanceController = require('../controllers/instance.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.post('/', instanceController.createInstance);
router.get('/', instanceController.getInstances);
router.patch('/:instanceId', instanceController.updateInstance);
router.post('/:instanceId/reconnect', instanceController.reconnectInstance);
router.delete('/:instanceId', instanceController.deleteInstance);

module.exports = router;
