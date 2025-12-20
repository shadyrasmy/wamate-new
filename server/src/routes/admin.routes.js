const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/admin.middleware');

// Public route FIRST to avoid middleware collision
const adminValidator = require('../validators/admin.validator');
const { validate } = require('../middlewares/validate.middleware');

// Public route FIRST to avoid middleware collision
router.get('/config/public', adminController.getPublicSiteConfig);

// Protected routes
router.use(protect);
router.use(requireAdmin);

router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.patch('/users/:userId', validate(adminValidator.updateUserPlanSchema), adminController.updateUserPlan);

// Plans
router.get('/plans', adminController.getPlans);
router.post('/plans', validate(adminValidator.createPlanSchema), adminController.createPlan);
router.patch('/plans/:planId', validate(adminValidator.createPlanSchema), adminController.updatePlan);
router.delete('/plans/:planId', adminController.deletePlan);

// Invoices
router.get('/invoices', adminController.getAllInvoices);
router.post('/invoices/:invoiceId/approve', adminController.approvePayment);
router.post('/invoices/:invoiceId/reject', adminController.rejectPayment);

// User Controls
router.delete('/users/:userId', adminController.deleteUser);
router.patch('/users/:userId/status', validate(adminValidator.banUserSchema), adminController.banUser);
router.post('/users/:userId/extend', validate(adminValidator.extendSubscriptionSchema), adminController.extendSubscription);

// Site Config
router.get('/config', adminController.getSiteConfig);
router.patch('/config', validate(adminValidator.updateSiteConfigSchema), adminController.updateSiteConfig);
router.post('/config/test-smtp', adminController.testSmtp);

// Manual Verification
router.patch('/users/:userId/verify-email', adminController.toggleEmailVerification);

// Email Templates
router.get('/config/templates', adminController.getTemplates);
router.patch('/config/templates/:key', adminController.updateTemplate);

module.exports = router;
