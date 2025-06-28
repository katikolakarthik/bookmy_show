const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const Show = require('../models/Show');

const router = express.Router();

// Validation rules for creating/updating a show
const showValidation = [
  body('venue').isMongoId().withMessage('Venue is required'),
  body('dateTime.start').isISO8601().withMessage('Start date/time is required'),
  body('dateTime.end').isISO8601().withMessage('End date/time is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration is required'),
  body('totalSeats').isInt({ min: 1 }).withMessage('Total seats required'),
  body('availableSeats').isInt({ min: 0 }).withMessage('Available seats required'),
  body('language').notEmpty().withMessage('Language is required'),
  body('showType').isIn(['movie', 'event']).withMessage('Show type must be movie or event'),
  validate
];

// GET /api/shows - List all shows (public)
router.get('/', async (req, res, next) => {
  try {
    const shows = await Show.find().populate('movie event venue');
    res.json({ success: true, data: shows });
  } catch (error) {
    next(error);
  }
});

// GET /api/shows/:id - Get single show (public)
router.get('/:id', async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id).populate('movie event venue');
    if (!show) return res.status(404).json({ success: false, error: 'Show not found' });
    res.json({ success: true, data: show });
  } catch (error) {
    next(error);
  }
});

// POST /api/shows - Create show (admin only)
router.post('/', protect, authorize('admin'), showValidation, async (req, res, next) => {
  try {
    const show = await Show.create(req.body);
    res.status(201).json({ success: true, data: show });
  } catch (error) {
    next(error);
  }
});

// PUT /api/shows/:id - Update show (admin only)
router.put('/:id', protect, authorize('admin'), showValidation, async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!show) return res.status(404).json({ success: false, error: 'Show not found' });
    res.json({ success: true, data: show });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/shows/:id - Delete show (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) return res.status(404).json({ success: false, error: 'Show not found' });
    res.json({ success: true, message: 'Show deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 