const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const Venue = require('../models/Venue');

const router = express.Router();

// Validation rules
const venueValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Venue name must be between 1 and 100 characters'),
  body('type')
    .isIn(['theater', 'auditorium', 'stadium', 'conference-hall', 'outdoor'])
    .withMessage('Invalid venue type'),
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('address.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of 2 numbers'),
  body('location.coordinates.*')
    .isFloat()
    .withMessage('Coordinates must be valid numbers'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer'),
  body('contactInfo.phone')
    .trim()
    .notEmpty()
    .withMessage('Contact phone is required'),
  body('contactInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid contact email'),
  validate
];

// Public routes
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Venue routes - implementation pending'
  });
});

// Admin routes
router.post('/', protect, authorize('admin'), venueValidation, async (req, res, next) => {
  try {
    const venue = await Venue.create(req.body);
    res.status(201).json({
      success: true,
      data: venue
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 