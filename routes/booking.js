const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking,
  lockSeats
} = require('../controllers/bookingController');

// All booking routes are protected
router.use(protect);

// User routes
router.post('/', createBooking);
router.get('/my-bookings', getUserBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);
router.post('/lock-seats', lockSeats);

module.exports = router; 