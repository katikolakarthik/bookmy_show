const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

console.log('Step 1: Starting import test');

const {
  reserveSeats,
  getReservation,
  convertToBooking,
  cancelReservation,
  getAvailableSeats,
  cleanExpiredReservations
} = require('./controllers/reservationController');

console.log('Step 2: Import completed');
console.log('cleanExpiredReservations type:', typeof cleanExpiredReservations);
console.log('cleanExpiredReservations value:', cleanExpiredReservations);

const { protect } = require('./middleware/auth');
const { isAdmin } = require('./middleware/auth');

console.log('Step 3: Middleware imported');

// Test the route definition
router.post('/test', protect, isAdmin, cleanExpiredReservations);

console.log('Step 4: Route defined successfully');

module.exports = router; 