const express = require('express');
const router = express.Router();
const instanceController = require('../controllers/instance.controller');
const { protect } = require('../middlewares/auth.middleware');

const instanceValidator = require('../validators/instance.validator');
const { validate } = require('../middlewares/validate.middleware');

router.use(protect);

router.post('/', validate(instanceValidator.createInstanceSchema), instanceController.createInstance);
router.get('/', instanceController.getInstances);
router.patch('/:instanceId', validate(instanceValidator.updateInstanceSchema), instanceController.updateInstance);
router.post('/:instanceId/reconnect', instanceController.reconnectInstance);
router.delete('/:instanceId', instanceController.deleteInstance);
router.patch('/:instanceId/toggle-chat', validate(instanceValidator.toggleChatSchema), instanceController.toggleChatLogging);
router.post('/:instanceId/pairing-code', validate(instanceValidator.pairingCodeSchema), instanceController.getPairingCode);

module.exports = router;
