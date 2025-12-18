const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller'); // Reuse getPlans
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', adminController.getPlans);

module.exports = router;
