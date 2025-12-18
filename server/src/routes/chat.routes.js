const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/chats', chatController.getRecentChats);
router.get('/messages', chatController.getMessages);
router.post('/send', chatController.sendMessage);
router.get('/send', chatController.sendMessage);
router.post('/upload', require('../middlewares/upload.middleware').single('file'), chatController.uploadMedia);
router.get('/contacts', chatController.getContacts);
router.get('/assigned', chatController.getAssignedChats);
router.post('/resolve', chatController.resolveChat);

module.exports = router;
