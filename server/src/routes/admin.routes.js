const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/admin.middleware');

// Public route FIRST to avoid middleware collision
router.get('/config/public', adminController.getPublicSiteConfig);

// Protected routes
router.use(protect);
router.use(requireAdmin);

router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.patch('/users/:userId', adminController.updateUserPlan);

// Plans
router.get('/plans', adminController.getPlans);
router.post('/plans', adminController.createPlan);
router.patch('/plans/:planId', adminController.updatePlan);
router.delete('/plans/:planId', adminController.deletePlan);

// Invoices
router.get('/invoices', adminController.getAllInvoices);

// User Controls
router.delete('/users/:userId', adminController.deleteUser);
router.patch('/users/:userId/status', adminController.banUser);
router.post('/users/:userId/extend', adminController.extendSubscription);

// Site Config
router.get('/config', adminController.getSiteConfig);
router.patch('/config', adminController.updateSiteConfig);

module.exports = router;
