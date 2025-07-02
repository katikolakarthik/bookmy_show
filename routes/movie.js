const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getMoviesByCity,
  getGenres,
  getLanguages,
  rateMovie
} = require('../controllers/movieController');

// Public routes
router.get('/', getMovies);
router.get('/genres', getGenres);
router.get('/languages', getLanguages);
router.get('/city/:city', getMoviesByCity);
router.get('/:id', getMovie);

// Protected routes
router.post('/:id/rate', protect, rateMovie);

// Admin only routes
router.post('/', protect, authorize('admin'), createMovie);
router.put('/:id', protect, authorize('admin'), updateMovie);
router.delete('/:id', protect, authorize('admin'), deleteMovie);

module.exports = router; 