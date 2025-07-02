const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  reserveSeats,
  getReservation,
  convertToBooking,
  cancelReservation,
  getAvailableSeats,
  cleanExpiredReservations
} = require('../controllers/reservationController');

// Public routes
router.get('/show/:showId/seats', getAvailableSeats);

// Protected routes
router.post('/reserve', protect, reserveSeats);
router.get('/:reservationId', protect, getReservation);
router.post('/:reservationId/convert', protect, convertToBooking);
router.delete('/:reservationId', protect, cancelReservation);

// Admin only routes
router.post('/clean-expired', protect, authorize('admin'), cleanExpiredReservations);

module.exports = router; 