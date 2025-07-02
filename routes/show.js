const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Placeholder routes for shows
// TODO: Create showController and implement these routes

// Public routes
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Shows API - Not implemented yet'
  });
});

router.get('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get show by ID - Not implemented yet'
  });
});

// Admin only routes
router.post('/', protect, authorize('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Create show - Not implemented yet'
  });
});

router.put('/:id', protect, authorize('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Update show - Not implemented yet'
  });
});

router.delete('/:id', protect, authorize('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Delete show - Not implemented yet'
  });
});

module.exports = router; 