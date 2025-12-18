const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seat.controller');
const { protect } = require('../middlewares/auth.middleware');

// Manager Routes (Protect with User Token)
router.use('/manage', protect);
router.post('/manage', seatController.createSeat);
router.get('/manage', seatController.getSeats);
router.delete('/manage/:seatId', seatController.deleteSeat);

// Seat Portal Routes (Public to Login, Protected for Self)
router.post('/login', seatController.login);
router.get('/me', protect, seatController.getMe);
router.patch('/status', protect, seatController.updateStatus); // Seat updates own status

module.exports = router;
