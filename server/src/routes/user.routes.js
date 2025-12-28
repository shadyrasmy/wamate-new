const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);

// Knowledge Base
router.get('/knowledge', userController.getKnowledge);
router.post('/knowledge', userController.createKnowledge);
router.patch('/knowledge/:knowledgeId', userController.updateKnowledge);
router.delete('/knowledge/:knowledgeId', userController.deleteKnowledge);

module.exports = router;
