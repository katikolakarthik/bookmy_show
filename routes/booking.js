const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validation');
const {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking,
  lockSeats
} = require('../controllers/bookingController');

const router = express.Router();

// Validation rules
const bookingValidation = [
  body('showId')
    .isMongoId()
    .withMessage('Please provide a valid show ID'),
  body('seats')
    .isArray({ min: 1, max: 10 })
    .withMessage('Please select between 1 and 10 seats'),
  body('seats.*.row')
    .notEmpty()
    .withMessage('Seat row is required'),
  body('seats.*.seatNumber')
    .notEmpty()
    .withMessage('Seat number is required'),
  body('seats.*.seatType')
    .isIn(['premium', 'executive', 'economy', 'balcony', 'box', 'vip'])
    .withMessage('Invalid seat type'),
  body('seats.*.price')
    .isFloat({ min: 0 })
    .withMessage('Seat price must be a positive number'),
  body('paymentMethod')
    .isIn(['credit-card', 'debit-card', 'upi', 'net-banking', 'wallet', 'cash'])
    .withMessage('Invalid payment method'),
  body('customerDetails.name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Customer name must be between 2 and 50 characters'),
  body('customerDetails.email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid customer email'),
  body('customerDetails.phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit customer phone number'),
  validate
];

const lockSeatsValidation = [
  body('showId')
    .isMongoId()
    .withMessage('Please provide a valid show ID'),
  body('seats')
    .isArray({ min: 1, max: 10 })
    .withMessage('Please select between 1 and 10 seats'),
  body('seats.*.row')
    .notEmpty()
    .withMessage('Seat row is required'),
  body('seats.*.seatNumber')
    .notEmpty()
    .withMessage('Seat number is required'),
  validate
];

const cancelBookingValidation = [
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Cancellation reason cannot exceed 500 characters'),
  validate
];

// All routes require authentication
router.use(protect);

// Routes
router.post('/', bookingValidation, createBooking);
router.get('/', getUserBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBookingValidation, cancelBooking);
router.post('/lock-seats', lockSeatsValidation, lockSeats);

module.exports = router; 