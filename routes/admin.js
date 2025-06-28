const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    // This would typically fetch statistics from various collections
    const stats = {
      totalUsers: 0,
      totalMovies: 0,
      totalEvents: 0,
      totalVenues: 0,
      totalBookings: 0,
      revenue: 0,
      activeShows: 0
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching dashboard stats'
    });
  }
});

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User management - implementation pending'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching users'
    });
  }
});

// @desc    Get all bookings (admin only)
// @route   GET /api/admin/bookings
// @access  Private (Admin only)
router.get('/bookings', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Booking management - implementation pending'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching bookings'
    });
  }
});

// @desc    Update user status (admin only)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
router.put('/users/:id/status', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User status update - implementation pending'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error updating user status'
    });
  }
});

module.exports = router; 