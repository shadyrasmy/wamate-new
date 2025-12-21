const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referral.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

// Protect all routes
router.use(protect);

// User Routes
router.get('/stats', referralController.getStats);

// Admin Routes
router.get('/admin/stats', restrictTo('admin'), referralController.adminGetStats);
router.post('/admin/settings', restrictTo('admin'), referralController.adminUpdateSettings);
router.post('/admin/adjust', restrictTo('admin'), referralController.adminAdjustBalance);

module.exports = router;
