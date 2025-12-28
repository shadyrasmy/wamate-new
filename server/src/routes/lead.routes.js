const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', leadController.getLeads);
router.get('/export', leadController.exportLeads);
router.patch('/:leadId', leadController.updateLead);
router.delete('/:leadId', leadController.deleteLead);

module.exports = router;
