const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movieController');

const router = express.Router();

// Validation rules
const movieValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),
  body('releaseDate')
    .isISO8601()
    .withMessage('Please provide a valid release date'),
  body('director')
    .trim()
    .notEmpty()
    .withMessage('Director is required'),
  body('poster')
    .isURL()
    .withMessage('Please provide a valid poster URL'),
  body('rating.censorBoard')
    .isIn(['U', 'UA', 'A', 'S'])
    .withMessage('Invalid censor board rating'),
  body('productionHouse')
    .trim()
    .notEmpty()
    .withMessage('Production house is required'),
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('Please provide a valid year'),
  validate
];

// Public routes
router.get('/', getMovies);
router.get('/:id', getMovie);

// Admin routes
router.post('/', protect, authorize('admin'), movieValidation, createMovie);
router.put('/:id', protect, authorize('admin'), movieValidation, updateMovie);
router.delete('/:id', protect, authorize('admin'), deleteMovie);

module.exports = router; 