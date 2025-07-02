const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/authController');

// All user routes are protected
router.use(protect);

// User profile routes (reusing auth controller functions)
router.get('/profile', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router; 