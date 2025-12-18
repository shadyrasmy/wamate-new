const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/admin.middleware');

// Protect all routes
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

module.exports = router;
