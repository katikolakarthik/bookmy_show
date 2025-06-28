const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const Event = require('../models/Event');

const router = express.Router();

// Validation rules
const eventValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Event title must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('type')
    .isIn(['concert', 'play', 'comedy', 'dance', 'sports', 'conference', 'workshop', 'exhibition', 'festival', 'other'])
    .withMessage('Invalid event type'),
  body('category')
    .isIn(['entertainment', 'sports', 'business', 'education', 'cultural', 'religious', 'social'])
    .withMessage('Invalid event category'),
  body('organizer.name')
    .trim()
    .notEmpty()
    .withMessage('Organizer name is required'),
  body('organizer.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid organizer email'),
  body('organizer.phone')
    .trim()
    .notEmpty()
    .withMessage('Organizer phone is required'),
  body('venue')
    .isMongoId()
    .withMessage('Please provide a valid venue ID'),
  body('dateTime.start')
    .isISO8601()
    .withMessage('Please provide a valid start date and time'),
  body('dateTime.end')
    .isISO8601()
    .withMessage('Please provide a valid end date and time'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),
  body('poster')
    .isURL()
    .withMessage('Please provide a valid poster URL'),
  validate
];

// Public routes
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Event routes - implementation pending'
  });
});

// Admin routes
router.post('/', protect, authorize('admin'), eventValidation, async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 