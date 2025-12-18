const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', contactController.getContacts);

module.exports = router;
