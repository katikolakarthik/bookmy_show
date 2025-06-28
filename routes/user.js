const express = require('express');
const { protect } = require('../middleware/auth');
const { getMe, updateProfile, changePassword } = require('../controllers/authController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes
router.get('/profile', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router; 