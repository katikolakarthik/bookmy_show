const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getVenues,
  getVenue,
  createVenue,
  updateVenue,
  deleteVenue,
  getVenuesByCity,
  getVenueTypes,
  getCities
} = require('../controllers/venueController');

// Public routes
router.get('/', getVenues);
router.get('/types', getVenueTypes);
router.get('/cities', getCities);
router.get('/city/:city', getVenuesByCity);
router.get('/:id', getVenue);

// Admin only routes
router.post('/', protect, authorize('admin'), createVenue);
router.put('/:id', protect, authorize('admin'), updateVenue);
router.delete('/:id', protect, authorize('admin'), deleteVenue);

module.exports = router; 