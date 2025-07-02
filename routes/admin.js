const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createAdmin,
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllBookings
} = require('../controllers/adminController');

// All admin routes require admin authorization
router.use(protect);
router.use(authorize('admin'));

// Admin routes
router.post('/create', createAdmin);
router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/bookings', getAllBookings);

module.exports = router; 