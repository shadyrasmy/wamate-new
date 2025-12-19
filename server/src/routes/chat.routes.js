const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { protect } = require('../middlewares/auth.middleware');

const chatValidator = require('../validators/chat.validator');
const { validate } = require('../middlewares/validate.middleware');

router.use(protect);

router.get('/chats', chatController.getRecentChats);
router.get('/messages', chatController.getMessages);
router.post('/send', validate(chatValidator.sendMessageSchema), chatController.sendMessage);
router.get('/send', chatController.sendMessage); // Optional: add query validation if needed
router.post('/upload', require('../middlewares/upload.middleware').single('file'), chatController.uploadMedia);
router.get('/contacts', chatController.getContacts);
router.get('/assigned', chatController.getAssignedChats);
router.post('/resolve', validate(chatValidator.resolveChatSchema), chatController.resolveChat);

module.exports = router;
