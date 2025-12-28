const express = require('express');
const router = express.Router();
const botController = require('../controllers/bot.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', botController.getBots);
router.post('/', botController.createBot);
router.patch('/:botId', botController.updateBot);
router.delete('/:botId', botController.deleteBot);

module.exports = router;
